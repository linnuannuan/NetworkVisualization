from queue import Queue

import mysql.connector

connection = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170', database='network')
cursor = connection.cursor()

#取出了所有
cursor.execute("select distinct source_id, target_id from edge where category != 'transaction'")
records = cursor.fetchall()

neighbors = {}
for source, target in records:
    if source not in neighbors:
        neighbors[source] = []
    neighbors[source].append(target)
    if target not in neighbors:
        neighbors[target] = []
    neighbors[target].append(source)

# print(neighbors)

groups = {}
number = 0
for vertex in neighbors:
    if vertex not in groups:
        queue = Queue()
        queue.put(vertex)
        while not queue.empty():
            vertex = queue.get()
            groups[vertex] = number
            for neighbor in neighbors[vertex]:
                if neighbor not in groups:
                    queue.put(neighbor)
        number += 1

records = groups.items()
# print(records)
#
# cursor.execute('create table vertex_group (vertex_id int, group_id int)')
# connection.commit()
#
# cursor.executemany('insert into vertex_group values (%s, %s)', records)
# connection.commit()
#
# cursor.execute('select source_id, target_id, category from edge')
# select_records = cursor.fetchall()
#
# insert_records = []
# for source, target, category in select_records:
#     if groups[source] == groups[target]:
#         insert_records.append((source, target, category, groups[source]))
#     else:
#         insert_records.append((source, target, category, None))
#
# cursor.execute('create table edge_group (source_id int, target_id int, category varchar(11), group_id int)')
# connection.commit()
#
# cursor.executemany('insert into edge_group values (%s, %s, %s, %s)', insert_records)
# connection.commit()

cursor.close()
connection.close()
