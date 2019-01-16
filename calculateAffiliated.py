from queue import Queue

import mysql.connector

connection = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170', database='network')
cursor = connection.cursor()

insert_records = []

cursor.execute("SELECT e1.source_id as vertex1, e1.target_id as vertex2, e1.category as category1 , e2.source_id as vertex3,\
e2.target_id as vertex4, e2.category as category2 FROM network.edge_group_2 as e1 , network.edge_group_2 as e2 where e1.group_id \
IS NOT NULL and e2.group_id is NOT NULL and e1.category = 'transaction' and e2.category in ('control','investment') and e1.source_\
id = e2.target_id")
records = cursor.fetchall()


affiliated_edge = []
for vertex1, vertex2, category1, vertex3, vertex4, category2 in records:
    # print(vertex3, vertex2)
    cursor.execute("select * from (select * from edge_group_2 where group_id is not null) as e where e.source_id = %s and e.target_id = %s and (e.category in ('control','investment'))", (vertex3, vertex2))
    # print("select * from edge_group_2 where group_id is not null) as e \
    # where e.source_id = s% and e.target_id = s% and (e.category in ('control','investment')", (vertex3, vertex2))
    edge_3 = cursor.fetchall()
    if(edge_3):
        for edge in edge_3 :
            # print(vertex3, vertex1, vertex2, category2, category1, edge[2])
            affiliated_edge.append((vertex3, vertex1, vertex2, category2, category1, edge[2]))
# print(affiliated_edge)

group = [];
iter = 1 ;
for edge in affiliated_edge:
    # print(edge[0], edge[1], edge[2], edge[3], edge[4], edge[5])
    # cursor.execute("SELECT * FROM vertex_group WHERE vertex_id = %s " % edge[1])
    # cursor.execute("SELECT * FROM vertex_group WHERE vertex_id = %s " % edge[2])
    # 以每个三角群组的人节点为三角群组的编号
    # num = cursor.fetchall()
    # if num[0][0] not in group:
    if edge[0] not in group:
        group.append(edge[0])

    cursor.execute("UPDATE vertex_group set three_affiliated_id = %s  WHERE vertex_id = %s ", (edge[0], edge[0]))
    connection.commit()
    cursor.execute("UPDATE vertex_group set three_affiliated_id = %s  WHERE vertex_id = %s ", (edge[0], edge[1]))
    connection.commit()
    cursor.execute("UPDATE vertex_group set three_affiliated_id = %s  WHERE vertex_id = %s ", (edge[0], edge[2]))
    connection.commit()

    cursor.execute("UPDATE edge_group_2 set three_affiliated_id = %s  WHERE source_id = %s and target_id = %s and category = %s ", (edge[0], edge[0], edge[1], edge[3]))
    # records = cursor.fetchall();
    connection.commit()
    # print(records)
    cursor.execute("UPDATE edge_group_2 set three_affiliated_id = %s  WHERE source_id = %s and target_id = %s and category = %s  ", (edge[0], edge[1], edge[2], edge[4]))
    # records = cursor.fetchall();
    connection.commit()
    # print(records)
    cursor.execute("UPDATE edge_group_2 set three_affiliated_id = %s  WHERE source_id = %s and target_id = %s and category = %s ", (edge[0], edge[0], edge[2], edge[5]))
    # records = cursor.fetchall();
    connection.commit()
    # print(records)


    # print(iter, edge[0], edge[1], edge[2])
    # cursor.execute(" SELECT group_id FROM vertex_group WHERE vertex_id = %s ", edge[0])
    # cursor.execute(" SELECT group_id FROM vertex_group WHERE vertex_id = %s ", edge[1])
    # cursor.execute(" SELECT group_id FROM vertex_group WHERE vertex_id = %s ", edge[2])

    # cursor.execute(" UPDATE vertex_group set affiliated_id = %s WHERE vertex_id in (%s,%s,%s) ", (iter, edge[0], edge[1], edge[2]))
    # cursor.execute(" UPDATE vertex_group set affiliated_id = %s WHERE vertex_id = %s ", (iter, edge[0]))
    # cursor.execute(" UPDATE vertex_group set affiliated_id = %s WHERE vertex_id = %s ", (iter, edge[0]))

    # iter = iter + 1 ;

    #更新了点的threeAffiliated
    # cursor.execute("UPDATE vertex_group set is_three_affiliated = 3  WHERE vertex_id = %s " % edge[0])
    # connection.commit()
    #
    # cursor.execute("UPDATE vertex_group set is_three_affiliated = 3  WHERE vertex_id = %s " % edge[1])
    # connection.commit()
    #
    # cursor.execute("UPDATE vertex_group set is_three_affiliated = 3  WHERE vertex_id = %s " % edge[2])
    # connection.commit()

    #更新了边的is_three_affiliated

    # cursor.execute("UPDATE edge_group_2 set is_three_affiliated = 3  WHERE source_id = %s and target_id = %s and category = %s ", (edge[0], edge[1], edge[3]))
    # # records = cursor.fetchall();
    # connection.commit()
    # # print(records)
    # cursor.execute("UPDATE edge_group_2 set is_three_affiliated = 3  WHERE source_id = %s and target_id = %s and category = %s  ", (edge[1], edge[2], edge[4]))
    # # records = cursor.fetchall();
    # connection.commit()
    # # print(records)
    # cursor.execute("UPDATE edge_group_2 set is_three_affiliated = 3  WHERE source_id = %s and target_id = %s and category = %s ", (edge[0], edge[2],edge[5]))
    # # records = cursor.fetchall();
    # connection.commit()
    # print(records)
print(group)
cursor.close()
connection.close()