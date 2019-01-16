import random

import mysql.connector

connection = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170', database='network')
cursor = connection.cursor()

group_id = 3904
# cursor.execute('select vertex_id, group_id from vertex_group')
cursor.execute('select vertex_id, group_id from vertex_group where group_id =%s' % group_id)

records = cursor.fetchall()

# print("select vertex_id, group_id from vertex_group where group_id =%s" % group_id)
print('get vertex:',records)

#对应的vertice重新计算
vertices = {}
for vertex, group in records:
    if group not in vertices:
        vertices[group] = []
    vertices[group].append(vertex)
print(vertices)


#获取对应groupid的所有边
# cursor.execute('select source_id, target_id, group_id from edge_group where group_id is not null')
cursor.execute('select source_id, target_id, group_id from edge_group where group_id =%s' % group_id)
records = cursor.fetchall()
print('select source_id, target_id, group_id from edge_group where group_id =%s' % group_id)


edges = {}
for source, target, group in records:
    if group not in edges:
        edges[group] = []
    edges[group].append((source, target))
random.seed(0)#特定随机数种子，对应固定随机数

# layouts = {}
# for group in vertices:
#     xs = {}
#     ys = {}
#     for vertex in vertices[group]:
#         xs[vertex] = random.random() - 0.5
#         ys[vertex] = random.random() - 0.5
#     for _ in range(10000):
#         x_offsets = {}
#         y_offsets = {}
#         for vertex in vertices[group]:
#             x_offsets[vertex] = 0
#             y_offsets[vertex] = 0
#         for vertex_1 in vertices[group]:
#             for vertex_2 in vertices[group]:
#                 if vertex_1 < vertex_2:
#                     x_delta = xs[vertex_1] - xs[vertex_2]
#                     y_delta = ys[vertex_1] - ys[vertex_2]
#                     distance_square = pow(x_delta, 2) + pow(y_delta, 2)
#                     offset = 1e-6 / distance_square
#                     distance = pow(distance_square, 0.5)
#                     x_offset = x_delta / distance * offset
#                     y_offset = y_delta / distance * offset
#                     x_offsets[vertex_1] += x_offset
#                     y_offsets[vertex_1] += y_offset
#                     x_offsets[vertex_2] -= x_offset
#                     y_offsets[vertex_2] -= y_offset
#         for source, target in edges[group]:
#             x_delta = xs[source] - xs[target]
#             y_delta = ys[source] - ys[target]
#             distance = pow(pow(x_delta, 2) + pow(y_delta, 2), 0.5)
#             if distance > 0.1:
#                 offset = 1e-2 * (distance - 0.1)
#                 x_offset = x_delta / distance * offset
#                 y_offset = y_delta / distance * offset
#                 x_offsets[source] -= x_offset
#                 y_offsets[source] -= y_offset
#                 x_offsets[target] += x_offset
#                 y_offsets[target] += y_offset
#         x_offset_sum = 0
#         y_offset_sum = 0
#         for vertex in vertices[group]:
#             x_offset_sum += abs(x_offsets[vertex])
#             y_offset_sum += abs(y_offsets[vertex])
#         if x_offset_sum < 1e-5 and y_offset_sum < 1e-5:
#             break
#         for vertex in vertices[group]:
#             xs[vertex] += x_offsets[vertex]
#             ys[vertex] += y_offsets[vertex]
#     x_base = (random.random() - 0.5) * 30
#     y_base = (random.random() - 0.5) * 30
#     for vertex in vertices[group]:
#         layouts[vertex] = (x_base + xs[vertex], y_base + ys[vertex])

# records = []
# for vertex in layouts:
#     records.append((vertex, layouts[vertex][0], layouts[vertex][1]))
# cursor.executemany('insert into vertex_layout values (%s, %s, %s, null)', records)
# connection.commit()


layouts = {}
cursor.execute('select * from network.vertex_layout where vertex_id in (50993,18111,29708,3384,60241)')
vertex_layouts = cursor.fetchall()
for vertex in vertex_layouts:
    print(vertex[0],vertex[1],vertex[2])
    layouts[vertex[0]]=(vertex[1],vertex[2])
    # layouts[vertex[0]][0] = vertex[1]
    # layouts[vertex[0]][1] = vertex[2]

print("get vertex layout", layouts)

# select_records 用于取出对应group id 的所有边
# cursor.execute('select source_id, target_id, category from edge_group where group_id = %s' % group_id)

source_id = 50993;
target_id = 60241;
cursor.execute('select source_id, target_id, category from edge_group where source_id= %s' % source_id +" and target_id = %s " %target_id);
print('select source_id, target_id, category from edge_group where source_id= %s' % source_id +" and target_id = %s " %target_id);


# cursor.execute('select source_id, target_id, category from edge_group where group_id = %s' % group_id);
select_records = cursor.fetchall()
print("select_records:", select_records)
# print('select source_id, target_id, category from edge_group where group_id = %s' % group_id)


# cursor.execute('select * from network.edge_layout')
# records = cursor.fetchall()
# print('get edge layout')


totals = {}
for source, target, _ in select_records:
    if (source, target) not in totals:
        totals[(source, target)] = 0
    totals[(source, target)] += 1
    if (target, source) not in totals:
        totals[(target, source)] = 0
    totals[(target, source)] += 1

numbers = {}
insert_records = []
for source, target, category in select_records:
    xs = [layouts[source][0]] * 2 + [layouts[target][0]] * 5
    ys = [layouts[source][1]] * 2 + [layouts[target][1]] * 5
    x_delta = layouts[target][0] - layouts[source][0]
    y_delta = layouts[target][1] - layouts[source][1]

    #根据已有的layout更新数据
    # xs = [layouts[1]] * 2 + [layouts[target][0]] * 5
    # ys = [layouts[2]] * 2 + [layouts[target][1]] * 5
    # x_delta = layouts[0] - layouts[source][0]
    # y_delta = layouts[target][1] - layouts[source][1]

    distance = pow(pow(x_delta, 2) + pow(y_delta, 2), 0.5)
    x_ratio = x_delta / distance
    y_ratio = y_delta / distance
    offset = 0.01
    x_offset = offset * x_ratio
    y_offset = offset * y_ratio
    for i in [0, 1]:
        xs[i] += x_offset
        ys[i] += y_offset
    for i in [2, 3, 4, 5]:
        xs[i] -= x_offset * 2
        ys[i] -= y_offset * 2
    xs[6] -= x_offset
    ys[6] -= y_offset
    if (source, target) not in numbers:
        numbers[(source, target)] = 0
    numbers[(source, target)] += 1
    offset = 0.02 / (totals[(source, target)] + 1) * numbers[(source, target)] - 0.01
    x_offset = offset * y_ratio
    y_offset = offset * x_ratio
    for i in [0, 1, 2, 3, 4, 5, 6]:
        xs[i] += x_offset
        ys[i] -= y_offset
    offset = 0.001
    x_offset = offset * y_ratio
    y_offset = offset * x_ratio
    for i in [0, 3]:
        xs[i] -= x_offset
        ys[i] += y_offset
    xs[4] -= x_offset * 3
    ys[4] += y_offset * 3
    for i in [1, 2]:
        xs[i] += x_offset

        ys[i] -= y_offset
    xs[5] += x_offset * 3
    ys[5] -= y_offset * 3
    insert_records.append((source, target, category, xs[0], ys[0], xs[1], ys[1], xs[2], ys[2], xs[3], ys[3], xs[4],
                           ys[4], xs[5], ys[5], xs[6], ys[6]))
print(insert_records)
# cursor.execute('create table edge_layout (source_id int, target_id int, category varchar(11), x_1 double, y_1 double, x\
# _2 double, y_2 double, x_3 double, y_3 double, x_4 double, y_4 double, x_5 double, y_5 double, x_6 double, y_6 double, \
# x_7 double, y_7 double)')
# connection.commit()

cursor.executemany('insert into edge_layout values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, null )'
                   , insert_records)
connection.commit()

cursor.close()
connection.close()