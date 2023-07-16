
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

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE FUNCTION "public"."increment"("slug_text" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
update views
set count = count + 1
where slug = slug_text;
$$;

ALTER FUNCTION "public"."increment"("slug_text" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE "public"."jokes" (
    "id" bigint NOT NULL,
    "created_at" "date" NOT NULL,
    "joke" "text"
);

ALTER TABLE "public"."jokes" OWNER TO "postgres";

ALTER TABLE "public"."jokes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."jokes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."views" (
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "count" smallint
);

ALTER TABLE "public"."views" OWNER TO "postgres";

ALTER TABLE ONLY "public"."jokes"
    ADD CONSTRAINT "jokes_joke_key" UNIQUE ("joke");

ALTER TABLE ONLY "public"."jokes"
    ADD CONSTRAINT "jokes_pkey" PRIMARY KEY ("created_at");

ALTER TABLE ONLY "public"."views"
    ADD CONSTRAINT "views_pkey" PRIMARY KEY ("slug");

CREATE POLICY "Enable read access for all users" ON "public"."jokes" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."views" USING (true);

ALTER TABLE "public"."jokes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."views" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."increment"("slug_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment"("slug_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment"("slug_text" "text") TO "service_role";

GRANT ALL ON TABLE "public"."jokes" TO "anon";
GRANT ALL ON TABLE "public"."jokes" TO "authenticated";
GRANT ALL ON TABLE "public"."jokes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."jokes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."jokes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."jokes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."views" TO "anon";
GRANT ALL ON TABLE "public"."views" TO "authenticated";
GRANT ALL ON TABLE "public"."views" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
