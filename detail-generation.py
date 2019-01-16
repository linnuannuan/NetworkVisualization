import cx_Oracle
import mysql.connector
import os

mysql_connection = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
mysql_cursor = mysql_connection.cursor()

mysql_cursor.execute('create table enterprise_detail (enterprise_id varchar(15), electronic_archive_number decimal(20),\
 name varchar(40), industry varchar(20))')
mysql_connection.commit()

mysql_cursor.execute('select id from enterprise')
records = mysql_cursor.fetchall()

enterprises = set()
for record in records:
    enterprises.add(record[0])

os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.AL32UTF8'
oracle_connection = cx_Oracle.connect('tax', 'taxgm2016', '192.168.16.186/tax')
oracle_cursor = oracle_connection.cursor()

oracle_cursor.execute("SELECT DJ_NSRXX.NSRSBH, DJ_NSRXX.NSRDZDAH, DJ_NSRXX.NSRMC, DM_HY.HY_MC FROM DJ_NSRXX, DM_HY WHER\
E REGEXP_LIKE(DJ_NSRXX.DJZCLX_DM, '^1[0-9]{2}$') AND REGEXP_LIKE(DJ_NSRXX.NSRSBH, '^[0-9]{6}([0-9]|[A-Z]){8}([0-9]|X)$'\
) AND DJ_NSRXX.HY_DM = DM_HY.HY_DM(+) UN"
                      "ION ALL SELECT SUBSTR(DJ_NSRXX.NSRSBH, 3, 15), DJ_NSRXX.NSRDZDAH, DJ_NSRXX.NSRM\
C, DM_HY.HY_MC FROM DJ_NSRXX, DM_HY WHERE REGEXP_LIKE(DJ_NSRXX.DJZCLX_DM, '^1[0-9]{2}$') AND REGEXP_LIKE(DJ_NSRXX.NSRSB\
H, '^91[0-9]{6}([0-9]|[A-Z]){8}([0-9]|X)([0-9]|[A-Y])$') AND DJ_NSRXX.HY_DM = DM_HY.HY_DM(+)")
select_records = oracle_cursor.fetchmany(10000)
while len(select_records) > 0:
    insert_records = []
    for record in select_records:
        if record[0] in enterprises:
            insert_records.append(record)
            enterprises.remove(record[0])
    mysql_cursor.executemany('insert into enterprise_detail values (%s, %s, %s, %s)', insert_records)
    mysql_connection.commit()
    select_records = oracle_cursor.fetchmany(10000)

mysql_cursor.execute('create table person_detail (person_id varchar(15), name varchar(400))')
mysql_connection.commit()

mysql_cursor.execute('select id from person')
records = mysql_cursor.fetchall()

persons = set()
for record in records:
    persons.add(record[0])

oracle_cursor.execute("SELECT SUBSTR(ZJHM, 1, 6) || SUBSTR(ZJHM, 9, 9), FDDBRMC FROM DJ_NSRXX WHERE FRZJLX_DM = '10' AN\
D REGEXP_LIKE(ZJHM, '^[0-9]{17}([0-9]|X)$') UNION ALL SELECT ZJHM, FDDBRMC FROM DJ_NSRXX WHERE FRZJLX_DM = '10' AND REG\
EXP_LIKE(ZJHM, '^[0-9]{15}$') UNION ALL SELECT SUBSTR(ZJHM, 1, 6) || SUBSTR(ZJHM, 9, 9), TZFMC FROM DJ_TZF WHERE ZJLX_D\
M = '10' AND REGEXP_LIKE(ZJHM, '^[0-9]{17}([0-9]|X)$') UNION ALL SELECT ZJHM, TZFMC FROM DJ_TZF WHERE ZJLX_DM = '10' AN\
D REGEXP_LIKE(ZJHM, '^[0-9]{15}$')")
select_records = oracle_cursor.fetchmany(10000)
while len(select_records) > 0:
    insert_records = []
    for record in select_records:
        if record[0] in persons:
            insert_records.append(record)
            persons.remove(record[0])
    mysql_cursor.executemany('insert into person_detail values (%s, %s)', insert_records)
    mysql_connection.commit()
    select_records = oracle_cursor.fetchmany(10000)

oracle_cursor.close()
oracle_connection.close()

mysql_cursor.close()
mysql_connection.close()
