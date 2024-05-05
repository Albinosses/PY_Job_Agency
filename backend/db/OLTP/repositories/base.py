from db.OLTP.models import Vacancy, Interview, Hire, SkillSetVacancy, SkillLevel, Contact
from db import db
from datetime import datetime


class VacancyRepository:
    @staticmethod
    def get_by_id(id: str):
        return Vacancy.query.get(id)

    @staticmethod
    def create(
        companyId,
        empCountryId,
        jobTitle,
        salary,
        employmentType,
        workSetting,
        publicationDate,
        status,
        description,
        closeDate,
    ):
        publicationDate_obj = datetime.strptime(publicationDate, "%m/%d/%Y")
        closeDate_obj = datetime.strptime(closeDate, "%m/%d/%Y")

        # Now format the datetime objects into the correct format "%Y-%m-%d"
        publicationDate = publicationDate_obj.strftime("%Y-%m-%d")
        closeDate = closeDate_obj.strftime("%Y-%m-%d")
        if status != "C":
            closeDate = None
        # last id
        last_id = Vacancy.query.order_by(Vacancy.id.desc()).first()
        id = last_id.id + 1

        new_vacancy = Vacancy(
            id=id,
            companyId=companyId,
            empCountryId=empCountryId,
            jobTitle=jobTitle,
            salary=salary,
            employmentType=employmentType,
            workSetting=workSetting,
            publicationDate=publicationDate,
            status=status,
            description=description,
            closeDate=closeDate,
        )
        db.session.add(new_vacancy)
        db.session.commit()
        db.session.flush()
        db.session.refresh(new_vacancy)
        return new_vacancy


class InterviewRepository:
    @staticmethod
    def get_by_id(id: str):
        return Interview.query.get(id)
    
    @staticmethod
    def create_or_get_interviewer(id: str):

    @staticmethod
    def create(
        vacancyId,
        candidateId,
        interviewerId,
        interviewType,
        interviewDate,
        duration,
        feedback,
        score,
    ):
        interviewDate_obj = datetime.strptime(interviewDate, "%m/%d/%Y")

        interviewDate = interviewDate_obj.strftime("%Y-%m-%d")

        # last id
        last_id = Interview.query.order_by(Interview.id.desc()).first()
        id = last_id.id + 1

        new_interview = Interview(
            id=id,
            vacancyId=vacancyId,
            candidateId=candidateId,
            interviewerId=interviewerId,
            interviewType=interviewType,
            interviewDate=interviewDate,
            duration=duration,
            feedback=feedback,
            score=score,
        )
        db.session.add(new_interview)
        db.session.commit()
        db.session.flush()
        db.session.refresh(new_interview)
        return new_interview


class HireRepository:
    @staticmethod
    def get_by_id(id: str):
        return Interview.query.get(id)

    @staticmethod
    def create(vacancyId, employeeId, hireDate):
        hireDate_obj = datetime.strptime(hireDate, "%m/%d/%Y")
        hireDate = hireDate_obj.strftime("%Y-%m-%d")

        # last id
        last_id = Hire.query.order_by(Hire.id.desc()).first()
        id = last_id.id + 1

        new_hire = Hire(
            id=id, vacancyId=vacancyId, employeeId=employeeId, hireDate=hireDate
        )

        db.session.add(new_hire)
        db.session.commit()
        db.session.flush()
        db.session.refresh(new_hire)
        return new_hire


class SkillSetVacancyRepository:
    @staticmethod
    def get_by_id(id: str):
        return Interview.query.get(id)

    @staticmethod
    def create(vacancyId, skillId, weight):
        # last id
        last_id = SkillSetVacancy.query.order_by(SkillSetVacancy.id.desc()).first()
        id = last_id.id + 1

        new_skillset = SkillSetVacancy(
            id=id, vacancyId=vacancyId, skillId=skillId, weight=weight
        )

        db.session.add(new_skillset)
        db.session.commit()
        db.session.flush()
        db.session.refresh(new_skillset)
        return new_skillset
    
    @staticmethod
    def create_skill(skill,level):
        last_id = SkillLevel.query.order_by(SkillLevel.id.desc()).first()
        id = last_id.id + 1

        new_skill = SkillLevel(
            id=id, skill=skill, level=level
        )

        db.session.add(new_skill)
        db.session.commit()
        db.session.flush()
        db.session.refresh(new_skill)
        return new_skill
    

