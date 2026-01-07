-- Rename the snmp_versions table to snmp_protocols
ALTER TABLE cvmanager.snmp_versions
    RENAME TO snmp_protocols

-- Rename the snmp_versions_snmp_version_id_seq sequence
ALTER SEQUENCE cvmanager.snmp_versions_snmp_version_id_seq
    RENAME TO snmp_protocols_snmp_version_id_seq

-- Update constraint names in the snmp_protocols table
ALTER TABLE cvmanager.snmp_protocols
    RENAME CONSTRAINT snmp_versions_pkey TO snmp_protocols_pkey

ALTER TABLE cvmanager.snmp_protocols
    RENAME CONSTRAINT snmp_versions_nickname TO snmp_protocols_nickname

-- Update column names in the snmp_protocols table
ALTER TABLE cvmanager.snmp_protocols
    RENAME COLUMN snmp_version_id TO snmp_protocol_id

ALTER TABLE cvmanager.snmp_protocols
    RENAME COLUMN version_code TO protocol_code

-- Update cvmanager.rsus foreign key and column name
ALTER TABLE cvmanager.rsus
    DROP CONSTRAINT fk_snmp_version_id

ALTER TABLE cvmanager.rsus
    RENAME COLUMN snmp_version_id TO snmp_protocol_id

ALTER TABLE cvmanager.rsus
    ADD CONSTRAINT fk_snmp_protocol_id FOREIGN KEY (snmp_protocol_id)
      REFERENCES cvmanager.snmp_protocols (snmp_protocol_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION