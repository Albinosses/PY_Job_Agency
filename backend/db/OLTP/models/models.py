from typing import List
from db.OLTP.models.base import db
from datetime import datetime


from sqlalchemy import (
    CheckConstraint,
    Column,
    Date,
    Double,
    ForeignKeyConstraint,
    Integer,
    LargeBinary,
    PrimaryKeyConstraint,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship
from sqlalchemy.orm.base import Mapped
from sqlalchemy import create_engine, Sequence
from sqlalchemy import String, Integer, Float, Boolean, Column
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Country(db.Model):
    __tablename__ = "Country"
    __table_args__ = (PrimaryKeyConstraint("id", name="Country_pkey"),)

    id = mapped_column(Integer)
    name = mapped_column(Text, nullable=False)

    Company: Mapped[List["Company"]] = relationship(
        "Company", uselist=True, back_populates="Country_"
    )
    Contact: Mapped[List["Contact"]] = relationship(
        "Contact", uselist=True, back_populates="Country_"
    )
    Vacancy: Mapped[List["Vacancy"]] = relationship(
        "Vacancy", uselist=True, back_populates="Country_"
    )

    def __repr__(self):
        return f"<Country {self.id} {self.name}>"

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
        }



class SkillLevel(db.Model):
    __tablename__ = "SkillLevel"
    __table_args__ = (
        CheckConstraint(
            "level = ANY (ARRAY['J'::\"char\", 'M'::\"char\", 'S'::\"char\", 'E'::\"char\"])",
            name="SkillLevel_level_check",
        ),
        PrimaryKeyConstraint("id", name="SkillLevel_pkey"),
    )

    id = mapped_column(Integer)
    skill = mapped_column(Text, nullable=False)
    level = mapped_column(String, nullable=False)

    SkillSetEmployee: Mapped[List["SkillSetEmployee"]] = relationship(
        "SkillSetEmployee", uselist=True, back_populates="SkillLevel_"
    )
    SkillSetVacancy: Mapped[List["SkillSetVacancy"]] = relationship(
        "SkillSetVacancy", uselist=True, back_populates="SkillLevel_"
    )


class Company(db.Model):
    __tablename__ = "Company"
    __table_args__ = (
        CheckConstraint(
            "size = ANY (ARRAY['S'::\"char\", 'M'::\"char\", 'L'::\"char\"])",
            name="Company_size_check",
        ),
        ForeignKeyConstraint(
            ["countryId"], ["Country.id"], name="Company_countryId_fkey"
        ),
        PrimaryKeyConstraint("id", name="Company_pkey"),
    )

    id = mapped_column(Integer)
    countryId = mapped_column(Integer, nullable=False)
    name = mapped_column(Text, nullable=False)
    size = mapped_column(String, nullable=False)

    Country_: Mapped["Country"] = relationship("Country", back_populates="Company")
    Vacancy: Mapped[List["Vacancy"]] = relationship(
        "Vacancy", uselist=True, back_populates="Company_"
    )
    def __repr__(self):
        return f"<Company {self.id} {self.name}>"

    def json(self):
        return {
            "id": self.id,
            "countryId": self.countryId,
            "name": self.name,
            "size": self.size,
        }



class Contact(db.Model):
    __tablename__ = "Contact"
    __table_args__ = (
        CheckConstraint(
            "gender = ANY (ARRAY['M'::\"char\", 'F'::\"char\"])",
            name="check_gender_symbol",
        ),
        ForeignKeyConstraint(
            ["countryId"], ["Country.id"], name="Contact_countryId_fkey"
        ),
        PrimaryKeyConstraint("id", name="Contact_pkey"),
    )

    id = mapped_column(Integer)
    countryId = mapped_column(Integer, nullable=False)
    name = mapped_column(Text, nullable=False)
    surname = mapped_column(Text, nullable=False)
    birthDate = mapped_column(Date, nullable=False)
    gender = mapped_column(String, nullable=False)
    email = mapped_column(Text, nullable=False)

    Country_: Mapped["Country"] = relationship("Country", back_populates="Contact")
    Employee: Mapped[List["Employee"]] = relationship(
        "Employee", uselist=True, back_populates="Contact_"
    )
    Interview: Mapped[List["Interview"]] = relationship(
        "Interview",
        uselist=True,
        foreign_keys="[Interview.candidateId]",
        back_populates="Contact_",
    )
    Interview_: Mapped[List["Interview"]] = relationship(
        "Interview",
        uselist=True,
        foreign_keys="[Interview.interviewerId]",
        back_populates="Contact1",
    )


class Employee(db.Model):
    __tablename__ = "Employee"
    __table_args__ = (
        ForeignKeyConstraint(
            ["contactId"], ["Contact.id"], name="Employee_contactId_fkey"
        ),
        PrimaryKeyConstraint("id", name="Employee_pkey"),
    )

    id = mapped_column(Integer)
    contactId = mapped_column(Integer, nullable=False)
    resume = mapped_column(LargeBinary)
    resumeUploadDate = mapped_column(Date)

    Contact_: Mapped["Contact"] = relationship("Contact", back_populates="Employee")
    Hire: Mapped[List["Hire"]] = relationship(
        "Hire", uselist=True, back_populates="Employee_"
    )
    SkillSetEmployee: Mapped[List["SkillSetEmployee"]] = relationship(
        "SkillSetEmployee", uselist=True, back_populates="Employee_"
    )


class Vacancy(db.Model):
    __tablename__ = "Vacancy"
    __table_args__ = (
        CheckConstraint('"closeDate" >= "publicationDate"', name="check_dates"),
        CheckConstraint(
            '"employmentType" = ANY (ARRAY[\'F\'::"char", \'C\'::"char", \'P\'::"char", \'L\'::"char"])',
            name="check_employmenttype_symbol",
        ),
        CheckConstraint(
            '"workSetting" = ANY (ARRAY[\'P\'::"char", \'H\'::"char", \'R\'::"char"])',
            name="check_worksetting_symbol",
        ),
        CheckConstraint(
            "status = ANY (ARRAY['C'::\"char\", 'O'::\"char\", 'P'::\"char\"])",
            name="check_status_symbol",
        ),
        ForeignKeyConstraint(
            ["companyId"], ["Company.id"], name="Vacancy_companyId_fkey"
        ),
        ForeignKeyConstraint(
            ["empCountryId"], ["Country.id"], name="Vacancy_empCountryId_fkey"
        ),
        PrimaryKeyConstraint("id", name="Vacancy_pkey"),
    )

    id = mapped_column(Integer)
    companyId = mapped_column(Integer, nullable=False)
    empCountryId = mapped_column(Integer, nullable=False)
    jobTitle = mapped_column(Text, nullable=False)
    salary = mapped_column(Integer, nullable=False)
    employmentType = mapped_column(String, nullable=False)
    workSetting = mapped_column(String, nullable=False)
    publicationDate = mapped_column(Date, nullable=False)
    status = mapped_column(String, nullable=False)
    description = mapped_column(Text)
    closeDate = mapped_column(Date)

    Company_: Mapped["Company"] = relationship("Company", back_populates="Vacancy")
    Country_: Mapped["Country"] = relationship("Country", back_populates="Vacancy")
    Hire: Mapped[List["Hire"]] = relationship(
        "Hire", uselist=True, back_populates="Vacancy_"
    )
    Interview: Mapped[List["Interview"]] = relationship(
        "Interview", uselist=True, back_populates="Vacancy_"
    )
    SkillSetVacancy: Mapped[List["SkillSetVacancy"]] = relationship(
        "SkillSetVacancy", uselist=True, back_populates="Vacancy_"
    )

    def __repr__(self):
        return f"<Vacancy {self.jobTitle} {self.salary}>"

    def json(self):
        return {
            "id": self.id,
            "companyId": self.companyId,
            "empCountryId": self.empCountryId,
            "jobTitle": self.jobTitle,
            "salary": self.salary,
            "employmentType": self.employmentType,
            "workSetting": self.workSetting,
            "publicationDate": self.publicationDate,
            "status": self.status,
            "description": self.description,
            "closeDate": self.closeDate
        }


class Hire(db.Model):
    __tablename__ = "Hire"
    __table_args__ = (
        ForeignKeyConstraint(
            ["employeeId"], ["Employee.id"], name="Hire_employeeId_fkey"
        ),
        ForeignKeyConstraint(["vacancyId"], ["Vacancy.id"], name="Hire_vacancyId_fkey"),
        PrimaryKeyConstraint("id", name="Hire_pkey"),
    )

    id = mapped_column(Integer)
    vacancyId = mapped_column(Integer, nullable=False)
    employeeId = mapped_column(Integer, nullable=False)
    hireDate = mapped_column(Date, nullable=False)

    Employee_: Mapped["Employee"] = relationship("Employee", back_populates="Hire")
    Vacancy_: Mapped["Vacancy"] = relationship("Vacancy", back_populates="Hire")
    def __repr__(self):
        return f"<Hire {self.vacancyId} {self.hireDate}>"

    def json(self):
        return {
            "id": self.id,
            "vacancyId": self.vacancyId,
            "employeeId": self.employeeId,
            "hireDate": self.hireDate
        }


class Interview(db.Model):
    __tablename__ = "Interview"
    __table_args__ = (
        CheckConstraint("score <= 10 AND score > 0", name="Interview_score_check"),
        ForeignKeyConstraint(
            ["candidateId"], ["Contact.id"], name="Interview_candidateId_fkey1"
        ),
        ForeignKeyConstraint(
            ["interviewerId"], ["Contact.id"], name="Interview_InterviewerId_fkey"
        ),
        ForeignKeyConstraint(
            ["vacancyId"], ["Vacancy.id"], name="Interview_vacancyId_fkey"
        ),
        PrimaryKeyConstraint("id", name="Interview_pkey"),
    )

    id = mapped_column(Integer)
    vacancyId = mapped_column(Integer, nullable=False)
    candidateId = mapped_column(Integer, nullable=False)
    interviewerId = mapped_column(Integer, nullable=False)
    interviewType = mapped_column(String, nullable=False)
    interviewDate = mapped_column(Date, nullable=False)
    duration = mapped_column(Integer, nullable=False)
    feedback = mapped_column(Text, nullable=False)
    score = mapped_column(Integer, nullable=False)

    Contact_: Mapped["Contact"] = relationship(
        "Contact", foreign_keys=[candidateId], back_populates="Interview"
    )
    Contact1: Mapped["Contact"] = relationship(
        "Contact", foreign_keys=[interviewerId], back_populates="Interview_"
    )
    Vacancy_: Mapped["Vacancy"] = relationship("Vacancy", back_populates="Interview")

    def __repr__(self):
        return f"<Interview {self.vacancyId} {self.feedback}>"

    def json(self):
        return {
            "id": self.id,
            "vacancyId": self.vacancyId,
            "candidateId": self.candidateId,
            "interviewerId": self.interviewerId,
            "interviewType": self.interviewType,
            "interviewDate": self.interviewDate,
            "duration": self.duration,
            "feedback": self.feedback,
            "score": self.score,
        }


class SkillSetEmployee(db.Model):
    __tablename__ = "SkillSetEmployee"
    __table_args__ = (
        ForeignKeyConstraint(
            ["ownerId"], ["Employee.id"], name="SkillSetEmployee_ownerId_fkey"
        ),
        ForeignKeyConstraint(
            ["skillId"], ["SkillLevel.id"], name="SkillSetEmployee_skillId_fkey"
        ),
        PrimaryKeyConstraint("id", name="SkillSetEmployee_pkey"),
    )

    id = mapped_column(Integer)
    ownerId = mapped_column(Integer, nullable=False)
    skillId = mapped_column(Integer, nullable=False)

    Employee_: Mapped["Employee"] = relationship(
        "Employee", back_populates="SkillSetEmployee"
    )
    SkillLevel_: Mapped["SkillLevel"] = relationship(
        "SkillLevel", back_populates="SkillSetEmployee"
    )


class SkillSetVacancy(db.Model):
    __tablename__ = "SkillSetVacancy"
    __table_args__ = (
        CheckConstraint(
            "weight >= 0::double precision AND weight <= 1::double precision",
            name="SkillSetVacancy_weight_check",
        ),
        ForeignKeyConstraint(
            ["skillId"],
            ["SkillLevel.id"],
            name="SkillSetVacancy_skilSetVacancy_skillId_fkey",
        ),
        ForeignKeyConstraint(
            ["vacancyId"], ["Vacancy.id"], name="SkillSetVacancy_vacancyId_fkey"
        ),
        PrimaryKeyConstraint("id", name="SkillSetVacancy_pkey"),
    )

    id = mapped_column(Integer)
    vacancyId = mapped_column(Integer, nullable=False)
    skillId = mapped_column(Integer, nullable=False)
    weight = mapped_column(Double(53), nullable=False)

    SkillLevel_: Mapped["SkillLevel"] = relationship(
        "SkillLevel", back_populates="SkillSetVacancy"
    )
    Vacancy_: Mapped["Vacancy"] = relationship(
        "Vacancy", back_populates="SkillSetVacancy"
    )
