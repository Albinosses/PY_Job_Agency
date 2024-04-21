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
-- Name: dimAdditionalRequirements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimAdditionalRequirements" (
    id integer NOT NULL,
    "employmentType" "char" NOT NULL,
    "workSetting" "char" NOT NULL,
    CONSTRAINT emp_type_check CHECK (("employmentType" = ANY (ARRAY['F'::"char", 'C'::"char", 'L'::"char", 'P'::"char"]))),
    CONSTRAINT work_setting_check CHECK (("workSetting" = ANY (ARRAY['R'::"char", 'P'::"char", 'H'::"char"])))
);


ALTER TABLE public."dimAdditionalRequirements" OWNER TO postgres;

--
-- Name: dimAge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimAge" (
    id integer NOT NULL,
    "ageGroup" integer NOT NULL
);


ALTER TABLE public."dimAge" OWNER TO postgres;

--
-- Name: dimCandidate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimCandidate" (
    id integer NOT NULL,
    "countryId" integer NOT NULL,
    "fullName" text NOT NULL,
    gender "char" NOT NULL,
    CONSTRAINT gender_check CHECK ((gender = ANY (ARRAY['M'::"char", 'F'::"char"])))
);


ALTER TABLE public."dimCandidate" OWNER TO postgres;

--
-- Name: dimCompany; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimCompany" (
    id integer NOT NULL,
    "countryId" integer NOT NULL,
    size "char" NOT NULL,
    CONSTRAINT size_check CHECK ((size = ANY (ARRAY['S'::"char", 'M'::"char", 'L'::"char"])))
);


ALTER TABLE public."dimCompany" OWNER TO postgres;

--
-- Name: dimCountry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimCountry" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."dimCountry" OWNER TO postgres;

--
-- Name: dimEmployee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimEmployee" (
    id integer NOT NULL,
    "countryId" integer NOT NULL,
    "ageId" integer NOT NULL,
    gender "char" NOT NULL,
    CONSTRAINT gender_check CHECK ((gender = ANY (ARRAY['M'::"char", 'F'::"char"])))
);


ALTER TABLE public."dimEmployee" OWNER TO postgres;

--
-- Name: dimInterviewer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimInterviewer" (
    id integer NOT NULL,
    "fullName" text NOT NULL,
    gender "char" NOT NULL,
    CONSTRAINT gender_check CHECK ((gender = ANY (ARRAY['M'::"char", 'F'::"char"])))
);


ALTER TABLE public."dimInterviewer" OWNER TO postgres;

--
-- Name: dimPosition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimPosition" (
    id integer NOT NULL,
    "countryId" integer NOT NULL,
    "additionalRId" integer NOT NULL,
    "jobTitle" text NOT NULL
);


ALTER TABLE public."dimPosition" OWNER TO postgres;

--
-- Name: dimSkillSet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimSkillSet" (
    "positionId" integer NOT NULL,
    "skillId" integer NOT NULL,
    weight real NOT NULL,
    CONSTRAINT weight_check CHECK (((weight >= (0)::double precision) AND (weight <= (1)::double precision)))
);


ALTER TABLE public."dimSkillSet" OWNER TO postgres;

--
-- Name: dimSkillsRequired; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimSkillsRequired" (
    id integer NOT NULL,
    skill text NOT NULL,
    level "char" NOT NULL,
    CONSTRAINT level_check CHECK ((level = ANY (ARRAY['J'::"char", 'M'::"char", 'S'::"char", 'E'::"char"])))
);


ALTER TABLE public."dimSkillsRequired" OWNER TO postgres;

--
-- Name: dimStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimStatus" (
    id integer NOT NULL,
    status text NOT NULL,
    CONSTRAINT status_check CHECK ((status = ANY (ARRAY['O'::text, 'P'::text, 'C'::text])))
);


ALTER TABLE public."dimStatus" OWNER TO postgres;

--
-- Name: dimTime; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dimTime" (
    "monthNumber" integer NOT NULL,
    "dayOfMonth" integer NOT NULL,
    day text NOT NULL,
    month text NOT NULL,
    year integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."dimTime" OWNER TO postgres;

--
-- Name: dimTime_new_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."dimTime_new_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."dimTime_new_id_seq" OWNER TO postgres;

--
-- Name: dimTime_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."dimTime_new_id_seq" OWNED BY public."dimTime".id;


--
-- Name: factHire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."factHire" (
    "companyId" integer NOT NULL,
    "timeId" integer NOT NULL,
    "positionId" integer NOT NULL,
    "employeeId" integer NOT NULL,
    salary integer NOT NULL,
    comission integer NOT NULL,
    days integer NOT NULL,
    "interviewN" integer NOT NULL,
    id integer NOT NULL,
    CONSTRAINT comission_check CHECK ((comission >= 0)),
    CONSTRAINT days_check CHECK ((days >= 0)),
    CONSTRAINT interviewn_check CHECK (("interviewN" >= 0)),
    CONSTRAINT salary_check CHECK ((salary >= 0))
);


ALTER TABLE public."factHire" OWNER TO postgres;

--
-- Name: factInterview; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."factInterview" (
    "ageId" integer NOT NULL,
    "positionId" integer NOT NULL,
    "candidateId" integer NOT NULL,
    "interviewerId" integer NOT NULL,
    "companyId" integer NOT NULL,
    "timeId" integer NOT NULL,
    score integer NOT NULL,
    "time" integer NOT NULL,
    id integer NOT NULL,
    CONSTRAINT score_check CHECK (((score >= 0) AND (score <= 10))),
    CONSTRAINT time_check CHECK (("time" >= 0))
);


ALTER TABLE public."factInterview" OWNER TO postgres;

--
-- Name: factVacancy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."factVacancy" (
    "companyId" integer NOT NULL,
    "positionId" integer NOT NULL,
    "timePublishedId" integer NOT NULL,
    "timeClosedId" integer,
    salary integer NOT NULL,
    "daysSinceOpening" integer NOT NULL,
    "interviewN" integer NOT NULL,
    "statusId" integer NOT NULL,
    id integer NOT NULL,
    CONSTRAINT days_since_opening_check CHECK (("daysSinceOpening" >= 0)),
    CONSTRAINT interview_n_check CHECK (("interviewN" >= 0)),
    CONSTRAINT salary_check CHECK ((salary >= 0))
);


ALTER TABLE public."factVacancy" OWNER TO postgres;

--
-- Name: dimTime id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimTime" ALTER COLUMN id SET DEFAULT nextval('public."dimTime_new_id_seq"'::regclass);


--
-- Name: dimAge dimAge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimAge"
    ADD CONSTRAINT "dimAge_pkey" PRIMARY KEY (id);


--
-- Name: dimCandidate dimCandidate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimCandidate"
    ADD CONSTRAINT "dimCandidate_pkey" PRIMARY KEY (id);


--
-- Name: dimCompany dimCompany_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimCompany"
    ADD CONSTRAINT "dimCompany_pkey" PRIMARY KEY (id);


--
-- Name: dimCountry dimCountry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimCountry"
    ADD CONSTRAINT "dimCountry_pkey" PRIMARY KEY (id);


--
-- Name: dimEmployee dimEmployee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimEmployee"
    ADD CONSTRAINT "dimEmployee_pkey" PRIMARY KEY (id);


--
-- Name: dimInterviewer dimInterviewer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimInterviewer"
    ADD CONSTRAINT "dimInterviewer_pkey" PRIMARY KEY (id);


--
-- Name: dimAdditionalRequirements dimPositionJ_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimAdditionalRequirements"
    ADD CONSTRAINT "dimPositionJ_pkey" PRIMARY KEY (id);


--
-- Name: dimPosition dimPosition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimPosition"
    ADD CONSTRAINT "dimPosition_pkey" PRIMARY KEY (id);


--
-- Name: dimSkillsRequired dimSkillsRequired_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimSkillsRequired"
    ADD CONSTRAINT "dimSkillsRequired_pkey" PRIMARY KEY (id);


--
-- Name: dimStatus dimStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimStatus"
    ADD CONSTRAINT "dimStatus_pkey" PRIMARY KEY (id);


--
-- Name: dimTime dimTime_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimTime"
    ADD CONSTRAINT "dimTime_pkey" PRIMARY KEY (id);


--
-- Name: factHire factHire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factHire"
    ADD CONSTRAINT "factHire_pkey" PRIMARY KEY (id);


--
-- Name: factInterview factInterview_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_pkey" PRIMARY KEY (id);


--
-- Name: factVacancy factVacancy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factVacancy"
    ADD CONSTRAINT "factVacancy_pkey" PRIMARY KEY (id);


--
-- Name: dimSkillSet unique_position_skill_combination; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimSkillSet"
    ADD CONSTRAINT unique_position_skill_combination UNIQUE ("positionId", "skillId");


--
-- Name: dimCandidate dimCandidate_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimCandidate"
    ADD CONSTRAINT "dimCandidate_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public."dimCountry"(id);


--
-- Name: dimCompany dimCompany_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimCompany"
    ADD CONSTRAINT "dimCompany_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public."dimCountry"(id);


--
-- Name: dimEmployee dimEmployee_ageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimEmployee"
    ADD CONSTRAINT "dimEmployee_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES public."dimAge"(id);


--
-- Name: dimEmployee dimEmployee_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimEmployee"
    ADD CONSTRAINT "dimEmployee_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public."dimCountry"(id);


--
-- Name: dimPosition dimPosition_additionalRId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimPosition"
    ADD CONSTRAINT "dimPosition_additionalRId_fkey" FOREIGN KEY ("additionalRId") REFERENCES public."dimAdditionalRequirements"(id);


--
-- Name: dimPosition dimPosition_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimPosition"
    ADD CONSTRAINT "dimPosition_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public."dimCountry"(id);


--
-- Name: dimSkillSet dimSkillSet_positionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimSkillSet"
    ADD CONSTRAINT "dimSkillSet_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES public."dimPosition"(id);


--
-- Name: dimSkillSet dimSkillSet_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dimSkillSet"
    ADD CONSTRAINT "dimSkillSet_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."dimSkillsRequired"(id);


--
-- Name: factHire factHire_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factHire"
    ADD CONSTRAINT "factHire_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."dimCompany"(id);


--
-- Name: factHire factHire_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factHire"
    ADD CONSTRAINT "factHire_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."dimEmployee"(id);


--
-- Name: factHire factHire_positionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factHire"
    ADD CONSTRAINT "factHire_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES public."dimPosition"(id);


--
-- Name: factHire factHire_timeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factHire"
    ADD CONSTRAINT "factHire_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES public."dimTime"(id) NOT VALID;


--
-- Name: factInterview factInterview_ageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES public."dimAge"(id);


--
-- Name: factInterview factInterview_candidateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES public."dimCandidate"(id);


--
-- Name: factInterview factInterview_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."dimCompany"(id);


--
-- Name: factInterview factInterview_interviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES public."dimInterviewer"(id);


--
-- Name: factInterview factInterview_positionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES public."dimPosition"(id);


--
-- Name: factInterview factInterview_timeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factInterview"
    ADD CONSTRAINT "factInterview_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES public."dimTime"(id) NOT VALID;


--
-- Name: factVacancy factVacancy_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factVacancy"
    ADD CONSTRAINT "factVacancy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."dimCompany"(id);


--
-- Name: factVacancy factVacancy_positionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factVacancy"
    ADD CONSTRAINT "factVacancy_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES public."dimPosition"(id);


--
-- Name: factVacancy factVacancy_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factVacancy"
    ADD CONSTRAINT "factVacancy_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."dimStatus"(id) NOT VALID;


--
-- Name: factVacancy factVacancy_timeClosedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factVacancy"
    ADD CONSTRAINT "factVacancy_timeClosedId_fkey" FOREIGN KEY ("timeClosedId") REFERENCES public."dimTime"(id) NOT VALID;


--
-- Name: factVacancy factVacancy_timePublishedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."factVacancy"
    ADD CONSTRAINT "factVacancy_timePublishedId_fkey" FOREIGN KEY ("timePublishedId") REFERENCES public."dimTime"(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

