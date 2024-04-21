--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id integer NOT NULL,
    "countryId" integer NOT NULL,
    name text NOT NULL,
    size "char" NOT NULL
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contact" (
    id integer NOT NULL,
    "countryId" integer NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    "birthDate" date NOT NULL,
    gender "char" NOT NULL,
    email text NOT NULL,
    CONSTRAINT check_gender_symbol CHECK ((gender = ANY (ARRAY['M'::"char", 'F'::"char"])))
);


ALTER TABLE public."Contact" OWNER TO postgres;

--
-- Name: Country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Country" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Country" OWNER TO postgres;

--
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employee" (
    id integer NOT NULL,
    "contactId" integer NOT NULL,
    resume bytea,
    "resumeUploadDate" date
);


ALTER TABLE public."Employee" OWNER TO postgres;

--
-- Name: Hire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Hire" (
    id integer NOT NULL,
    "vacancyId" integer NOT NULL,
    "employeeId" integer NOT NULL,
    "hireDate" date NOT NULL
);


ALTER TABLE public."Hire" OWNER TO postgres;

--
-- Name: Interview; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Interview" (
    id integer NOT NULL,
    "vacancyId" integer NOT NULL,
    "candidateId" integer NOT NULL,
    "interviewerId" integer NOT NULL,
    "interviewType" "char" NOT NULL,
    "interviewDate" date NOT NULL,
    duration integer NOT NULL,
    feedback text NOT NULL,
    score integer NOT NULL
);


ALTER TABLE public."Interview" OWNER TO postgres;

--
-- Name: SkillLevel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillLevel" (
    id integer NOT NULL,
    skill text NOT NULL,
    level "char" NOT NULL
);


ALTER TABLE public."SkillLevel" OWNER TO postgres;

--
-- Name: SkillSetEmployee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillSetEmployee" (
    id integer NOT NULL,
    "ownerId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."SkillSetEmployee" OWNER TO postgres;

--
-- Name: SkillSetVacancy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillSetVacancy" (
    id integer NOT NULL,
    "vacancyId" integer NOT NULL,
    "skillId" integer NOT NULL,
    weight double precision NOT NULL
);


ALTER TABLE public."SkillSetVacancy" OWNER TO postgres;

--
-- Name: Vacancy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vacancy" (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "empCountryId" integer NOT NULL,
    "jobTitle" text NOT NULL,
    description text,
    salary integer NOT NULL,
    "employmentType" "char" NOT NULL,
    "workSetting" "char" NOT NULL,
    "publicationDate" date NOT NULL,
    "closeDate" date,
    status "char" NOT NULL,
    CONSTRAINT check_dates CHECK (("closeDate" >= "publicationDate")),
    CONSTRAINT check_employmenttype_symbol CHECK (("employmentType" = ANY (ARRAY['F'::"char", 'C'::"char", 'P'::"char", 'L'::"char"]))),
    CONSTRAINT check_status_symbol CHECK ((status = ANY (ARRAY['C'::"char", 'O'::"char", 'P'::"char"]))),
    CONSTRAINT check_worksetting_symbol CHECK (("workSetting" = ANY (ARRAY['P'::"char", 'H'::"char", 'R'::"char"])))
);


ALTER TABLE public."Vacancy" OWNER TO postgres;

--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_size_check; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public."Company"
    ADD CONSTRAINT "Company_size_check" CHECK ((size = ANY (ARRAY['S'::"char", 'M'::"char", 'L'::"char"]))) NOT VALID;


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: Country Country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Country"
    ADD CONSTRAINT "Country_pkey" PRIMARY KEY (id);


--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- Name: Hire Hire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Hire"
    ADD CONSTRAINT "Hire_pkey" PRIMARY KEY (id);


--
-- Name: Interview Interview_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_pkey" PRIMARY KEY (id);


--
-- Name: Interview Interview_score_check; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public."Interview"
    ADD CONSTRAINT "Interview_score_check" CHECK (((score <= 10) AND (score > 0))) NOT VALID;


--
-- Name: SkillLevel SkillLevel_level_check; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public."SkillLevel"
    ADD CONSTRAINT "SkillLevel_level_check" CHECK ((level = ANY (ARRAY['J'::"char", 'M'::"char", 'S'::"char", 'E'::"char"]))) NOT VALID;


--
-- Name: SkillLevel SkillLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillLevel"
    ADD CONSTRAINT "SkillLevel_pkey" PRIMARY KEY (id);


--
-- Name: SkillSetEmployee SkillSetEmployee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillSetEmployee"
    ADD CONSTRAINT "SkillSetEmployee_pkey" PRIMARY KEY (id);


--
-- Name: SkillSetVacancy SkillSetVacancy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillSetVacancy"
    ADD CONSTRAINT "SkillSetVacancy_pkey" PRIMARY KEY (id);


--
-- Name: SkillSetVacancy SkillSetVacancy_weight_check; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public."SkillSetVacancy"
    ADD CONSTRAINT "SkillSetVacancy_weight_check" CHECK (((weight >= (0)::double precision) AND (weight <= (1)::double precision))) NOT VALID;


--
-- Name: Vacancy Vacancy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacancy"
    ADD CONSTRAINT "Vacancy_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public."Country"(id);


--
-- Name: Contact Contact_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public."Country"(id);


--
-- Name: Employee Employee_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id);


--
-- Name: Hire Hire_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Hire"
    ADD CONSTRAINT "Hire_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) NOT VALID;


--
-- Name: Hire Hire_vacancyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Hire"
    ADD CONSTRAINT "Hire_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES public."Vacancy"(id);


--
-- Name: Interview Interview_InterviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_InterviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES public."Contact"(id) NOT VALID;


--
-- Name: Interview Interview_candidateId_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_candidateId_fkey1" FOREIGN KEY ("candidateId") REFERENCES public."Contact"(id) NOT VALID;


--
-- Name: Interview Interview_vacancyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES public."Vacancy"(id) NOT VALID;


--
-- Name: SkillSetEmployee SkillSetEmployee_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillSetEmployee"
    ADD CONSTRAINT "SkillSetEmployee_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Employee"(id);


--
-- Name: SkillSetEmployee SkillSetEmployee_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillSetEmployee"
    ADD CONSTRAINT "SkillSetEmployee_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."SkillLevel"(id);


--
-- Name: SkillSetVacancy SkillSetVacancy_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillSetVacancy"
    ADD CONSTRAINT "SkillSetVacancy_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."SkillLevel"(id);


--
-- Name: SkillSetVacancy SkillSetVacancy_vacancyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillSetVacancy"
    ADD CONSTRAINT "SkillSetVacancy_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES public."Vacancy"(id);


--
-- Name: Vacancy Vacancy_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacancy"
    ADD CONSTRAINT "Vacancy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) NOT VALID;


--
-- Name: Vacancy Vacancy_empCountryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacancy"
    ADD CONSTRAINT "Vacancy_empCountryId_fkey" FOREIGN KEY ("empCountryId") REFERENCES public."Country"(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

