CREATE OR REPLACE FUNCTION vd_insert_record (new_key TEXT, new_val TEXT)
RETURNS json AS
$$
BEGIN
  INSERT INTO vd_keystore(vd_key,vd_value) VALUES (new_key, new_val);
  RETURN (SELECT row_to_json(vd_keystore) FROM vd_keystore where vd_key = new_key order by key_timestamp DESC limit 1);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION vd_fetch_record (new_key TEXT)
RETURNS json AS
$$
BEGIN
  RETURN (SELECT row_to_json(vd_keystore) FROM vd_keystore where vd_key = new_key order by key_timestamp DESC limit 1);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION vd_fetch_record_by_timestamp (new_key TEXT, key_ts TEXT)
RETURNS json AS
$$
BEGIN
  RETURN (SELECT row_to_json(vd_keystore) FROM vd_keystore where vd_key = new_key and key_timestamp <= to_timestamp(key_ts,'YYYY-MM-DD HH24:MI:SS') order by key_timestamp DESC limit 1);
END;
$$ LANGUAGE 'plpgsql';