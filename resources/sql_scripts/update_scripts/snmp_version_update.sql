-- Run this SQL update script if you already have a deployed CV Manager PostgreSQL database prior to the SNMP version addition
-- This file will create the 'snmp_versions' table and add NTCIP 1218 and RSU 4.1 as SNMP versions
-- All RSUs are given the default of RSU 4.1 as their SNMP version using this script

CREATE SEQUENCE cvmanager.snmp_versions_snmp_version_id_seq
   INCREMENT 1
   START 1
   MINVALUE 1
   MAXVALUE 2147483647
   CACHE 1;

CREATE TABLE IF NOT EXISTS cvmanager.snmp_versions
(
   snmp_version_id integer NOT NULL DEFAULT nextval('snmp_versions_snmp_version_id_seq'::regclass),
   version_code character varying(128) COLLATE pg_catalog.default NOT NULL,
   nickname character varying(128) COLLATE pg_catalog.default NOT NULL,
   CONSTRAINT snmp_versions_pkey PRIMARY KEY (snmp_version_id),
   CONSTRAINT snmp_versions_nickname UNIQUE (nickname)
);

INSERT INTO cvmanager.snmp_versions(
	version_code, nickname)
	VALUES ('41', 'RSU 4.1');
INSERT INTO cvmanager.snmp_versions(
	version_code, nickname)
	VALUES ('1218', 'NTCIP 1218');

ALTER TABLE cvmanager.rsus
        ADD snmp_version_id integer NOT NULL
    DEFAULT (1);

ALTER TABLE cvmanager.rsus     
    ADD CONSTRAINT fk_snmp_version_id FOREIGN KEY (snmp_version_id)
      REFERENCES cvmanager.snmp_versions (snmp_version_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION