from typing import List, Optional

from sqlalchemy import CheckConstraint, Column, Date, Float, ForeignKeyConstraint, Integer, PrimaryKeyConstraint, Sequence, String, Table, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship       
from sqlalchemy.orm.base import Mapped

Base = declarative_base()
metadata = Base.metadata


class DimAdditionalRequirements(Base):
    __tablename__ = 'dimAdditionalRequirements'
    __table_args__ = (
        CheckConstraint('"employmentType" = ANY (ARRAY[\'F\'::"char", \'C\'::"char", \'L\'::"char", \'P\'::"char"])', name='emp_type_check'),
        CheckConstraint('"workSetting" = ANY (ARRAY[\'R\'::"char", \'P\'::"char", \'H\'::"char"])', name='work_setting_check'),
        PrimaryKeyConstraint('id', name='dimPositionJ_pkey')
    )

    id = mapped_column(Integer)
    employmentType = mapped_column(String, nullable=False)
    workSetting = mapped_column(String, nullable=False)

    dimPosition: Mapped[List['DimPosition']] = relationship('DimPosition', uselist=True, back_populates='dimAdditionalRequirements')


class DimAge(Base):
    __tablename__ = 'dimAge'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='dimAge_pkey'),
    )

    id = mapped_column(Integer)
    ageGroup = mapped_column(Integer, nullable=False)

    dimEmployee: Mapped[List['DimEmployee']] = relationship('DimEmployee', uselist=True, back_populates='dimAge')
    factInterview: Mapped[List['FactInterview']] = relationship('FactInterview', uselist=True, back_populates='dimAge')


class DimCountry(Base):
    __tablename__ = 'dimCountry'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='dimCountry_pkey'),
    )

    id = mapped_column(Integer)
    name = mapped_column(Text, nullable=False)

    dimCandidate: Mapped[List['DimCandidate']] = relationship('DimCandidate', uselist=True, back_populates='dimCountry')
    dimCompany: Mapped[List['DimCompany']] = relationship('DimCompany', uselist=True, back_populates='dimCountry')
    dimEmployee: Mapped[List['DimEmployee']] = relationship('DimEmployee', uselist=True, back_populates='dimCountry')
    dimPosition: Mapped[List['DimPosition']] = relationship('DimPosition', uselist=True, back_populates='dimCountry')


class DimInterviewer(Base):
    __tablename__ = 'dimInterviewer'
    __table_args__ = (
        CheckConstraint('gender = ANY (ARRAY[\'M\'::"char", \'F\'::"char"])', name='gender_check'),
        PrimaryKeyConstraint('id', name='dimInterviewer_pkey')
    )

    id = mapped_column(Integer)
    fullName = mapped_column(Text, nullable=False)
    gender = mapped_column(String, nullable=False)

    factInterview: Mapped[List['FactInterview']] = relationship('FactInterview', uselist=True, back_populates='dimInterviewer')


class DimSkillsRequired(Base):
    __tablename__ = 'dimSkillsRequired'
    __table_args__ = (
        CheckConstraint('level = ANY (ARRAY[\'J\'::"char", \'M\'::"char", \'S\'::"char", \'E\'::"char"])', name='level_check'),
        PrimaryKeyConstraint('id', name='dimSkillsRequired_pkey')
    )

    id = mapped_column(Integer)
    skill = mapped_column(Text, nullable=False)
    level = mapped_column(String, nullable=False)


class DimStatus(Base):
    __tablename__ = 'dimStatus'
    __table_args__ = (
        CheckConstraint("status = ANY (ARRAY['O'::text, 'P'::text, 'C'::text])", name='status_check'),
        PrimaryKeyConstraint('id', name='dimStatus_pkey')
    )

    id = mapped_column(Integer)
    status = mapped_column(Text, nullable=False)

    factVacancy: Mapped[List['FactVacancy']] = relationship('FactVacancy', uselist=True, back_populates='dimStatus')


class DimTime(Base):
    __tablename__ = 'dimTime'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='dimTime_pkey'),
    )

    id = mapped_column(Integer, Sequence('dimTime_new_id_seq'))
    date = mapped_column(Date, nullable=False)
    year = mapped_column(Integer, nullable=False)
    month = mapped_column(Integer, nullable=False)
    day = mapped_column(Integer, nullable=False)
    weekDay = mapped_column(Text, nullable=False)

    factHire: Mapped[List['FactHire']] = relationship('FactHire', uselist=True, back_populates='dimTime')
    factInterview: Mapped[List['FactInterview']] = relationship('FactInterview', uselist=True, back_populates='dimTime')
    factVacancy: Mapped[List['FactVacancy']] = relationship('FactVacancy', uselist=True, foreign_keys='[FactVacancy.timeClosedId]', back_populates='dimTime')
    factVacancy_: Mapped[List['FactVacancy']] = relationship('FactVacancy', uselist=True, foreign_keys='[FactVacancy.timePublishedId]', back_populates='dimTime_')


class DimCandidate(Base):
    __tablename__ = 'dimCandidate'
    __table_args__ = (
        CheckConstraint('gender = ANY (ARRAY[\'M\'::"char", \'F\'::"char"])', name='gender_check'),
        ForeignKeyConstraint(['countryId'], ['dimCountry.id'], name='dimCandidate_countryId_fkey'),
        PrimaryKeyConstraint('id', name='dimCandidate_pkey')
    )

    id = mapped_column(Integer)
    countryId = mapped_column(Integer, nullable=False)
    fullName = mapped_column(Text, nullable=False)
    gender = mapped_column(String, nullable=False)

    dimCountry: Mapped['DimCountry'] = relationship('DimCountry', back_populates='dimCandidate')
    factInterview: Mapped[List['FactInterview']] = relationship('FactInterview', uselist=True, back_populates='dimCandidate')


class DimCompany(Base):
    __tablename__ = 'dimCompany'
    __table_args__ = (
        CheckConstraint('size = ANY (ARRAY[\'S\'::"char", \'M\'::"char", \'L\'::"char"])', name='size_check'),
        ForeignKeyConstraint(['countryId'], ['dimCountry.id'], name='dimCompany_countryId_fkey'),
        PrimaryKeyConstraint('id', name='dimCompany_pkey')
    )

    id = mapped_column(Integer)
    countryId = mapped_column(Integer, nullable=False)
    size = mapped_column(String, nullable=False)

    dimCountry: Mapped['DimCountry'] = relationship('DimCountry', back_populates='dimCompany')
    factHire: Mapped[List['FactHire']] = relationship('FactHire', uselist=True, back_populates='dimCompany')
    factInterview: Mapped[List['FactInterview']] = relationship('FactInterview', uselist=True, back_populates='dimCompany')
    factVacancy: Mapped[List['FactVacancy']] = relationship('FactVacancy', uselist=True, back_populates='dimCompany')


class DimEmployee(Base):
    __tablename__ = 'dimEmployee'
    __table_args__ = (
        CheckConstraint('gender = ANY (ARRAY[\'M\'::"char", \'F\'::"char"])', name='gender_check'),
        ForeignKeyConstraint(['ageId'], ['dimAge.id'], name='dimEmployee_ageId_fkey'), 
        ForeignKeyConstraint(['countryId'], ['dimCountry.id'], name='dimEmployee_countryId_fkey'),
        PrimaryKeyConstraint('id', name='dimEmployee_pkey')
    )

    id = mapped_column(Integer)
    countryId = mapped_column(Integer, nullable=False)
    ageId = mapped_column(Integer, nullable=False)
    gender = mapped_column(String, nullable=False)

    dimAge: Mapped['DimAge'] = relationship('DimAge', back_populates='dimEmployee')    
    dimCountry: Mapped['DimCountry'] = relationship('DimCountry', back_populates='dimEmployee')
    factHire: Mapped[List['FactHire']] = relationship('FactHire', uselist=True, back_populates='dimEmployee')


class DimPosition(Base):
    __tablename__ = 'dimPosition'
    __table_args__ = (
        ForeignKeyConstraint(['additionalRId'], ['dimAdditionalRequirements.id'], name='dimPosition_additionalRId_fkey'),
        ForeignKeyConstraint(['countryId'], ['dimCountry.id'], name='dimPosition_countryId_fkey'),
        PrimaryKeyConstraint('id', name='dimPosition_pkey')
    )

    id = mapped_column(Integer)
    countryId = mapped_column(Integer, nullable=False)
    additionalRId = mapped_column(Integer, nullable=False)
    jobTitle = mapped_column(Text, nullable=False)

    dimAdditionalRequirements: Mapped['DimAdditionalRequirements'] = relationship('DimAdditionalRequirements', back_populates='dimPosition')
    dimCountry: Mapped['DimCountry'] = relationship('DimCountry', back_populates='dimPosition')
    factHire: Mapped[List['FactHire']] = relationship('FactHire', uselist=True, back_populates='dimPosition')
    factInterview: Mapped[List['FactInterview']] = relationship('FactInterview', uselist=True, back_populates='dimPosition')
    factVacancy: Mapped[List['FactVacancy']] = relationship('FactVacancy', uselist=True, back_populates='dimPosition')


t_dimSkillSet = Table(
    'dimSkillSet', metadata,
    Column('positionId', Integer, nullable=False),
    Column('skillId', Integer, nullable=False),
    Column('weight', Float, nullable=False),
    CheckConstraint('weight >= 0::double precision AND weight <= 1::double precision', name='weight_check'),
    ForeignKeyConstraint(['positionId'], ['dimPosition.id'], name='dimSkillSet_positionId_fkey'),
    ForeignKeyConstraint(['skillId'], ['dimSkillsRequired.id'], name='dimSkillSet_skillId_fkey'),
    UniqueConstraint('positionId', 'skillId', name='unique_position_skill_combination')
)


class FactHire(Base):
    __tablename__ = 'factHire'
    __table_args__ = (
        CheckConstraint('"interviewN" >= 0', name='interviewn_check'),
        CheckConstraint('comission >= 0', name='comission_check'),
        CheckConstraint('days >= 0', name='days_check'),
        CheckConstraint('salary >= 0', name='salary_check'),
        ForeignKeyConstraint(['companyId'], ['dimCompany.id'], name='factHire_companyId_fkey'),
        ForeignKeyConstraint(['employeeId'], ['dimEmployee.id'], name='factHire_employeeId_fkey'),
        ForeignKeyConstraint(['positionId'], ['dimPosition.id'], name='factHire_positionId_fkey'),
        ForeignKeyConstraint(['timeId'], ['dimTime.id'], name='factHire_timeId_fkey'), 
        PrimaryKeyConstraint('id', name='factHire_pkey')
    )

    companyId = mapped_column(Integer, nullable=False)
    timeId = mapped_column(Integer, nullable=False)
    positionId = mapped_column(Integer, nullable=False)
    employeeId = mapped_column(Integer, nullable=False)
    salary = mapped_column(Integer, nullable=False)
    comission = mapped_column(Integer, nullable=False)
    days = mapped_column(Integer, nullable=False)
    interviewN = mapped_column(Integer, nullable=False)
    id = mapped_column(Integer)

    dimCompany: Mapped['DimCompany'] = relationship('DimCompany', back_populates='factHire')
    dimEmployee: Mapped['DimEmployee'] = relationship('DimEmployee', back_populates='factHire')
    dimPosition: Mapped['DimPosition'] = relationship('DimPosition', back_populates='factHire')
    dimTime: Mapped['DimTime'] = relationship('DimTime', back_populates='factHire')    


class FactInterview(Base):
    __tablename__ = 'factInterview'
    __table_args__ = (
        CheckConstraint('"time" >= 0', name='time_check'),
        CheckConstraint('score >= 0 AND score <= 10', name='score_check'),
        ForeignKeyConstraint(['ageId'], ['dimAge.id'], name='factInterview_ageId_fkey'),
        ForeignKeyConstraint(['candidateId'], ['dimCandidate.id'], name='factInterview_candidateId_fkey'),
        ForeignKeyConstraint(['companyId'], ['dimCompany.id'], name='factInterview_companyId_fkey'),
        ForeignKeyConstraint(['interviewerId'], ['dimInterviewer.id'], name='factInterview_interviewerId_fkey'),
        ForeignKeyConstraint(['positionId'], ['dimPosition.id'], name='factInterview_positionId_fkey'),
        ForeignKeyConstraint(['timeId'], ['dimTime.id'], name='factInterview_timeId_fkey'),
        PrimaryKeyConstraint('id', name='factInterview_pkey')
    )

    ageId = mapped_column(Integer, nullable=False)
    positionId = mapped_column(Integer, nullable=False)
    candidateId = mapped_column(Integer, nullable=False)
    interviewerId = mapped_column(Integer, nullable=False)
    companyId = mapped_column(Integer, nullable=False)
    timeId = mapped_column(Integer, nullable=False)
    score = mapped_column(Integer, nullable=False)
    time = mapped_column(Integer, nullable=False)
    id = mapped_column(Integer)

    dimAge: Mapped['DimAge'] = relationship('DimAge', back_populates='factInterview')  
    dimCandidate: Mapped['DimCandidate'] = relationship('DimCandidate', back_populates='factInterview')
    dimCompany: Mapped['DimCompany'] = relationship('DimCompany', back_populates='factInterview')
    dimInterviewer: Mapped['DimInterviewer'] = relationship('DimInterviewer', back_populates='factInterview')
    dimPosition: Mapped['DimPosition'] = relationship('DimPosition', back_populates='factInterview')
    dimTime: Mapped['DimTime'] = relationship('DimTime', back_populates='factInterview')


class FactVacancy(Base):
    __tablename__ = 'factVacancy'
    __table_args__ = (
        CheckConstraint('"daysSinceOpening" >= 0', name='days_since_opening_check'),   
        CheckConstraint('"interviewN" >= 0', name='interview_n_check'),
        CheckConstraint('salary >= 0', name='salary_check'),
        ForeignKeyConstraint(['companyId'], ['dimCompany.id'], name='factVacancy_companyId_fkey'),
        ForeignKeyConstraint(['positionId'], ['dimPosition.id'], name='factVacancy_positionId_fkey'),
        ForeignKeyConstraint(['statusId'], ['dimStatus.id'], name='factVacancy_statusId_fkey'),
        ForeignKeyConstraint(['timeClosedId'], ['dimTime.id'], name='factVacancy_timeClosedId_fkey'),
        ForeignKeyConstraint(['timePublishedId'], ['dimTime.id'], name='factVacancy_timePublishedId_fkey'),
        PrimaryKeyConstraint('id', name='factVacancy_pkey')
    )

    companyId = mapped_column(Integer, nullable=False)
    positionId = mapped_column(Integer, nullable=False)
    timePublishedId = mapped_column(Integer, nullable=False)
    salary = mapped_column(Integer, nullable=False)
    daysSinceOpening = mapped_column(Integer, nullable=False)
    interviewN = mapped_column(Integer, nullable=False)
    statusId = mapped_column(Integer, nullable=False)
    id = mapped_column(Integer)
    timeClosedId = mapped_column(Integer)

    dimCompany: Mapped['DimCompany'] = relationship('DimCompany', back_populates='factVacancy')
    dimPosition: Mapped['DimPosition'] = relationship('DimPosition', back_populates='factVacancy')
    dimStatus: Mapped['DimStatus'] = relationship('DimStatus', back_populates='factVacancy')
    dimTime: Mapped[Optional['DimTime']] = relationship('DimTime', foreign_keys=[timeClosedId], back_populates='factVacancy')
    dimTime_: Mapped['DimTime'] = relationship('DimTime', foreign_keys=[timePublishedId], back_populates='factVacancy_')