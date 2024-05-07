import random
import pandas as pd
from datetime import datetime, timedelta

def generate_random_date():
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2023, 12, 31)
    
    # Calculate the range in days
    delta = end_date - start_date
    
    # Generate a random number of days
    random_days = random.randint(0, delta.days)
    
    # Generate the random date
    random_date = start_date + timedelta(days=random_days)
    
    return random_date.strftime('%Y-%m-%d')

def generate_random_date_after(start_date_str):
    # Convert the start_date_str to a datetime object
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    
    # Calculate the range in days from the start_date to today
    delta = datetime.now() - start_date
    
    # Generate a random number of days after the start_date
    random_days = random.randint(0, delta.days)
    
    # Generate the random date
    random_date = start_date + timedelta(days=random_days)
    
    return random_date.strftime('%Y-%m-%d')

def generate_random_date_before(end_date_str):
    # Convert the end_date_str to a datetime object
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    
    # Calculate the range in days from the earliest date possible to the end_date
    delta = end_date - datetime.min
    
    # Generate a random number of days before the end_date
    random_days = random.randint(0, delta.days)
    
    # Generate the random date
    random_date = end_date - timedelta(days=random_days)
    
    return random_date.strftime('%Y-%m-%d')

def generate_random_date_between(start_date_str, end_date_str):
    # Convert the start_date_str and end_date_str to datetime objects
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    
    # Calculate the range in days between start_date and end_date
    delta = end_date - start_date
    
    # Generate a random number of days between start_date and end_date
    random_days = random.randint(0, delta.days)
    
    # Generate the random date
    random_date = start_date + timedelta(days=random_days)
    
    return random_date.strftime('%Y-%m-%d')


    

data = pd.read_csv("./database/jobs_in_data.csv") # Завантаження первинних даних з датасету

all_countries = pd.concat([data["company_location"], data["employee_residence"]], ignore_index=True) # Отримуємо унікальні країни, які знаходяться в датасеті

countries = pd.DataFrame(all_countries.unique(),columns=["name"]) # створення окремого датасету для країн з метою первинної заливки в OLTP

countries.to_csv("./database/data/countries.csv",index=False)

names = ['John', 'Emily', 'Michael', 'Sophia', 'William', 'Emma', 'Matthew', 'Olivia', 'James', 'Ava',
         'Daniel', 'Isabella', 'Ethan', 'Mia', 'Alexander', 'Charlotte', 'David', 'Abigail', 'Joseph', 'Elizabeth']

surnames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
            'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson']

genders = ['M', 'F']

domains = ['example.com', 'test.com', 'sample.com']

data_list = []
for i in range(len(data)):
    name = random.choice(names)
    surname = random.choice(surnames)
    
    # Generate random birthdate between 1950 and 2005
    birthDate = (datetime.now() - timedelta(days=random.randint(365*18, 365*45))).strftime('%Y-%m-%d')
    
    gender = random.choice(genders)
    
    email = f"{name.lower()}.{surname.lower()}.{i}@{random.choice(domains)}"

    country = countries['name'][countries['name']==data["employee_residence"][i]].index[0] + 1
    
    entry = {"name":name,"surname":surname,"birthDate":birthDate,"gender":gender,"email":email,"countryId":country}

    data_list.append(entry)

name = "Interviewer"
surname = "First"

# Generate random birthdate between 1950 and 2005
birthDate = (datetime.now() - timedelta(days=random.randint(365*18, 365*45))).strftime('%Y-%m-%d')

gender = random.choice(genders)

email = f"{'inter'.lower()}.{'first'.lower()}.@{random.choice(domains)}"

country = countries['name'][countries['name']==data["employee_residence"][i]].index[0] + 1

entry = {"name":name,"surname":surname,"birthDate":birthDate,"gender":gender,"email":email,"countryId":country}

data_list.append(entry)

name = "Interviewer"
surname = "Second"

# Generate random birthdate between 1950 and 2005
birthDate = (datetime.now() - timedelta(days=random.randint(365*18, 365*45))).strftime('%Y-%m-%d')

gender = random.choice(genders)

email = f"{'inter'.lower()}.{'second'.lower()}.@{random.choice(domains)}"

country = countries['name'][countries['name']==data["employee_residence"][i]].index[0] + 1

entry = {"name":name,"surname":surname,"birthDate":birthDate,"gender":gender,"email":email,"countryId":country}

data_list.append(entry)

contacts = pd.DataFrame(data_list, columns=["name","surname","birthDate","gender","email","countryId"]) 
contacts.to_csv("./database/data/contacts.csv",index=False) # збереження контактів у csv форматі]

skills = ["Python Programming","SQL", "Data Cleaning","Exploratory Data Analysis (EDA)","Data Manipulation","Excel","Data Mining","Basic Statistics","Data Preprocessing","Research Skills"]
levels = ["J","M","S","E"]
skills_pd = []
for skill in skills:
    for level in levels:
        skills_pd.append({"skill":skill,"level":level})

skills_pd = pd.DataFrame(skills_pd, columns = ["skill","level"])
skills_pd.to_csv("./database/data/skills.csv", index=False) 

skill_set_vacancy = []

for i in range(len(data)):
    skill_number = random.randint(3,10) # вибір рандомної кількості навичок для роботи
    weights = [random.randint(1,5) for _ in range(skill_number)] # встановлення ваг для навички
    s = sum(weights)
    weights = [weights[i]/s for i in range(len(weights))] # нормалізація ваг
    skills_used = []
    for j in range(skill_number):
        vacancyId = i + 1

        skill_req = skills[random.randint(0,9)] # вибір випадкової навички
        while skills_used.count(skill_req)!=0:
            skill_req = skills[random.randint(0,9)]
        skills_used.append(skill_req)  

        level_req = levels[random.randint(0,3)] # вибір випадкового рівня навички

        skillId = skills_pd[(skills_pd["skill"]==skill_req) & (skills_pd["level"]==level_req)].index[0] + 1
        
        weight = weights[j]

        skill_set_vacancy.append({"vacancyId":vacancyId,"skillId":skillId,"weight":weight})
    
skill_set_vacancy_df =pd.DataFrame(skill_set_vacancy, columns=["vacancyId","skillId","weight"])

skill_set_vacancy_df.to_csv("./database/data/skill_set_vacancy.csv", index=False)

# COMPANIES DF
companies = [
    "Ubisoft",
    "Apple",
    "Samsung",
    "Nvidia",
    "Asus",
    "Xiaomi",
    "Sony"
]
companies_names = []

countries = data.get("company_location")

cs = data.get("company_size")

for i in range(len(cs)):
    tmp = random.choice(companies) + countries[i].replace(" ", "") + cs[i]
    companies_names.append(tmp)

sizes = data.get("company_size")
countries_temp = pd.DataFrame(all_countries.unique(),columns=["name"])

ids_dict = countries_temp['name'].reset_index().to_dict(orient='records')
ids_dict = {item['name']: item['index'] + 1 for item in ids_dict}
ids = []

for country in countries:
    ids.append(ids_dict[country])

companies_pd = {
    "countryId": ids,
    "name": companies_names,
    "size": sizes
}

companies_pd = pd.DataFrame(companies_pd,columns=["countryId", "name","size"])

companies_pd_unique = companies_pd.drop_duplicates(subset=["name"]).reset_index(drop=True)

companies_pd_unique.to_csv("./database/data/companies.csv", index=False)


vacancies_closed = [] # 7000 
vacancies_opened = [] # 7000-9000
vacancies_postponed = [] # 9000- len(data)

countries = countries_temp
companies = companies_pd_unique

for i in range(0,7000):
    proper_companies = (companies[(companies["countryId"]==countries["name"][countries["name"]==data["company_location"][i]].index[0] + 1) & (companies["size"]==data["company_size"][i])]) # підбір списку вакансій, які підходять під умову датасету (країна, розмір компанії)
    company_name = proper_companies['name'].sample().values[0]
    companyId = companies[companies['name'] == company_name].index[0] + 1
    
    empCountryId = countries[(data["employee_residence"][i]==countries["name"])].index[0] + 1 # знаходження id країни працівника
    jobTitle = data["job_title"][i]
    description = "Hello! We are really good company and want to hire you"
    salary = data["salary_in_usd"][i]
    employmentType = ""
    if data["employment_type"][i]=="Full-time":
        employmentType = "F"
    elif data["employment_type"][i]=="Contract":
        employmentType = "C"
    elif data["employment_type"][i]=="Part-time":
        employmentType = "P"
    else:
        employmentType = "L"

    workSetting = ""
    if data["work_setting"][i]=="In-person":
        workSetting = "P"
    elif data["work_setting"][i]=="Remote":
        workSetting = "R"
    else:
        workSetting = "H"
    publicationDate = generate_random_date()
    closeDate = generate_random_date_after(publicationDate)
    status = "C"
    vacancies_closed.append({"companyId":companyId,"empCountryId":empCountryId,"jobTitle":jobTitle,"description":description,"salary":salary,"employmentType":employmentType,"workSetting":workSetting,"publicationDate":publicationDate,"closeDate":closeDate,"status":status})

for i in range(7000,9000):
    proper_companies = (companies[(companies["countryId"]==countries["name"][countries["name"]==data["company_location"][i]].index[0] + 1) & (companies["size"]==data["company_size"][i])]) # підбір списку вакансій, які підходять під умову датасету (країна, розмір компанії)
    company_name = proper_companies['name'].sample().values[0]
    companyId = companies[companies['name'] == company_name].index[0] + 1
    
    empCountryId = countries[(data["employee_residence"][i]==countries["name"])].index[0] + 1 # знаходження id країни працівника
    jobTitle = data["job_title"][i]
    description = "Hello! We are really good company and want to hire you"
    salary = data["salary_in_usd"][i]
    employmentType = ""
    if data["employment_type"][i]=="Full-time":
        employmentType = "F"
    elif data["employment_type"][i]=="Contract":
        employmentType = "C"
    elif data["employment_type"][i]=="Part-time":
        employmentType = "P"
    else:
        employmentType = "L"

    workSetting = ""
    if data["work_setting"][i]=="In-person":
        workSetting = "P"
    elif data["work_setting"][i]=="Remote":
        workSetting = "R"
    else:
        workSetting = "H"
    publicationDate = generate_random_date()
    closeDate = None
    status = "O"
    vacancies_opened.append({"companyId":companyId,"empCountryId":empCountryId,"jobTitle":jobTitle,"description":description,"salary":salary,"employmentType":employmentType,"workSetting":workSetting,"publicationDate":publicationDate,"closeDate":closeDate,"status":status})

for i in range(9000,len(data)):
    proper_companies = (companies[(companies["countryId"]==countries["name"][countries["name"]==data["company_location"][i]].index[0] + 1) & (companies["size"]==data["company_size"][i])]) # підбір списку вакансій, які підходять під умову датасету (країна, розмір компанії)
    company_name = proper_companies['name'].sample().values[0]
    companyId = companies[companies['name'] == company_name].index[0] + 1
    
    empCountryId = countries[(data["employee_residence"][i]==countries["name"])].index[0] + 1 # знаходження id країни працівника
    jobTitle = data["job_title"][i]
    description = "Hello! We are really good company and want to hire you"
    salary = data["salary_in_usd"][i]
    employmentType = ""
    if data["employment_type"][i]=="Full-time":
        employmentType = "F"
    elif data["employment_type"][i]=="Contract":
        employmentType = "C"
    elif data["employment_type"][i]=="Part-time":
        employmentType = "P"
    else:
        employmentType = "L"

    workSetting = ""
    if data["work_setting"][i]=="In-person":
        workSetting = "P"
    elif data["work_setting"][i]=="Remote":
        workSetting = "R"
    else:
        workSetting = "H"
    publicationDate = generate_random_date()
    closeDate = None
    status = "P"
    vacancies_postponed.append({"companyId":companyId,"empCountryId":empCountryId,"jobTitle":jobTitle,"description":description,"salary":salary,"employmentType":employmentType,"workSetting":workSetting,"publicationDate":publicationDate,"closeDate":closeDate,"status":status})

vacancies_closed =pd.DataFrame(vacancies_closed, columns=["companyId","empCountryId","jobTitle","description","salary","employmentType","workSetting","publicationDate","closeDate","status"])
vacancies_opened =pd.DataFrame(vacancies_opened, columns=["companyId","empCountryId","jobTitle","description","salary","employmentType","workSetting","publicationDate","closeDate","status"])
vacancies_postponed =pd.DataFrame(vacancies_postponed, columns=["companyId","empCountryId","jobTitle","description","salary","employmentType","workSetting","publicationDate","closeDate","status"])

vacancies_combined = pd.concat([vacancies_closed, vacancies_opened, vacancies_postponed], ignore_index=True)
vacancies_combined.to_csv("./database/data/vacancies.csv", index=False)


employee = []
for i in range(len(vacancies_closed)):
    contactId = i + 1
    resume = None
    resumeUploadDate = generate_random_date_before(vacancies_closed['publicationDate'][i])
    employee.append({"contactId":contactId,"resume":resume,"resumeUploadDate":resumeUploadDate})

employee_df =pd.DataFrame(employee, columns=["contactId","resume","resumeUploadDate"])
employee_df.to_csv("./database/data/employee_without_resume.csv",index=False)

hire = []
for i in range(len(vacancies_closed)):
    vacancyId = i + 1
    employeeId = i + 1
    hireDate = vacancies_closed["closeDate"][i]
    hire.append({"vacancyId":vacancyId,"employeeId":employeeId,"hireDate":hireDate})

hire_df =pd.DataFrame(hire, columns=["vacancyId","employeeId","hireDate"])
hire_df.to_csv("./database/data/hire.csv",index=False)

skill_set_employee = []
for i in range(len(vacancies_closed)):
    skill_number = random.randint(3,10)
    skills_used = []
    for j in range(skill_number):
        ownerId = i + 1

        skill_req = skills[random.randint(0,9)]
        while skills_used.count(skill_req)!=0:
            skill_req = skills[random.randint(0,9)]
        skills_used.append(skill_req)  

        level_req = levels[random.randint(0,3)]

        skillId = skills_pd[(skills_pd["skill"]==skill_req) & (skills_pd["level"]==level_req)].index[0] + 1
        
        skill_set_employee.append({"ownerId":ownerId,"skillId":skillId})
    
skill_set_employee_df = pd.DataFrame(skill_set_employee,columns=["ownerId","skillId"])
skill_set_employee_df.to_csv("./database/data/skill_set_employee.csv", index=False)

interview = []
interviewers = [9356,9357] # id в contacts людей, що проводять інтерв'ю
interview_types = ["S","H","T"] # типи інтерв'ю

for i in range(len(vacancies_closed)):
    vacancyId = i + 1
    candidateId = i + 1
    interviewerId = random.choice(interviewers)
    interviewType =  random.choice(interview_types)
    interviewDate = generate_random_date_after(vacancies_closed["publicationDate"][i])
    duration = random.randint(40,60)
    feedback = "Passed"
    score = random.randint(8,10)
    interview.append({"vacancyId":vacancyId,"candidateId":candidateId,"interviewerId":interviewerId,"interviewType":interviewType,"interviewDate":interviewDate,"duration":duration,"feedback":feedback,"score":score})


for i in range(len(vacancies_closed)):
    vacancyId = i + 1
    interview_number = random.randint(1,10)
    for j in range(interview_number):
        candidateId = random.randint(len(vacancies_closed)+1,len(data))
        interviewerId = random.choice(interviewers)
        interviewType =  random.choice(interview_types)
        interviewDate = generate_random_date_between(vacancies_closed["publicationDate"][i],interview[vacancyId-1]["interviewDate"])
        duration = random.randint(20,40)
        feedback = "Failed"
        score = random.randint(3,7)
        interview.append({"vacancyId":vacancyId,"candidateId":candidateId,"interviewerId":interviewerId,"interviewType":interviewType,"interviewDate":interviewDate,"duration":duration,"feedback":feedback,"score":score})

for i in range(len(vacancies_opened)):
    vacancyId = len(vacancies_closed) + i + 1
    interview_number = random.randint(1,10)
    for j in range(interview_number):
        candidateId = random.randint(len(vacancies_closed)+1,len(data))
        interviewerId = random.choice(interviewers)
        interviewType =  random.choice(interview_types)
        interviewDate = generate_random_date_after(vacancies_opened["publicationDate"][i])
        duration = random.randint(20,40)
        feedback = "Failed"
        score = random.randint(4,7)
        interview.append({"vacancyId":vacancyId,"candidateId":candidateId,"interviewerId":interviewerId,"interviewType":interviewType,"interviewDate":interviewDate,"duration":duration,"feedback":feedback,"score":score})

    


for i in range(len(vacancies_postponed)):
    vacancyId = len(vacancies_closed) + len(vacancies_opened) + i + 1
    interview_number = random.randint(1,10)
    for j in range(interview_number):
        candidateId = len(vacancies_closed) + len(vacancies_opened) + i + 1
        interviewerId = random.choice(interviewers)
        interviewType =  random.choice(interview_types)
        interviewDate = generate_random_date_after(vacancies_postponed["publicationDate"][i])
        duration = random.randint(40,60)
        feedback = "Failed"
        score = random.randint(4,7)
        interview.append({"vacancyId":vacancyId,"candidateId":candidateId,"interviewerId":interviewerId,"interviewType":interviewType,"interviewDate":interviewDate,"duration":duration,"feedback":feedback,"score":score})

interview_df = pd.DataFrame(interview,columns=["vacancyId","candidateId","interviewerId","interviewType","interviewDate","duration","feedback","score"])
interview_df.to_csv("./database/data/interviews.csv", index=False)