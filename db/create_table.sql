CREATE TABLE IF NOT EXISTS vd_keystore (
  VD_KEY TEXT NOT NULL,
  VD_VALUE TEXT NOT NULL,
  KEY_TIMESTAMP TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);