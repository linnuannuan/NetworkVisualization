import random

import mysql.connector

connection = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170', database='network')
cursor = connection.cursor()

cursor.execute('select vertex_id, group_id from vertex_group')
records = cursor.fetchall()

vertices = {}
for vertex, group in records:
    if group not in vertices:
        vertices[group] = []
    vertices[group].append(vertex)

cursor.execute('select source_id, target_id, group_id from edge_group where group_id is not null')
records = cursor.fetchall()

edges = {}
for source, target, group in records:
    if group not in edges:
        edges[group] = []
    edges[group].append((source, target))

random.seed(0)
layouts = {}
for group in vertices:
    xs = {}
    ys = {}
    for vertex in vertices[group]:
        xs[vertex] = random.random() - 0.5
        ys[vertex] = random.random() - 0.5
    for _ in range(10000):
        x_offsets = {}
        y_offsets = {}
        for vertex in vertices[group]:
            x_offsets[vertex] = 0
            y_offsets[vertex] = 0
        for vertex_1 in vertices[group]:
            for vertex_2 in vertices[group]:
                if vertex_1 < vertex_2:
                    x_delta = xs[vertex_1] - xs[vertex_2]
                    y_delta = ys[vertex_1] - ys[vertex_2]
                    distance_square = pow(x_delta, 2) + pow(y_delta, 2)
                    offset = 1e-6 / distance_square
                    distance = pow(distance_square, 0.5)
                    x_offset = x_delta / distance * offset
                    y_offset = y_delta / distance * offset
                    x_offsets[vertex_1] += x_offset
                    y_offsets[vertex_1] += y_offset
                    x_offsets[vertex_2] -= x_offset
                    y_offsets[vertex_2] -= y_offset
        for source, target in edges[group]:
            x_delta = xs[source] - xs[target]
            y_delta = ys[source] - ys[target]
            distance = pow(pow(x_delta, 2) + pow(y_delta, 2), 0.5)
            if distance > 0.1:
                offset = 1e-2 * (distance - 0.1)
                x_offset = x_delta / distance * offset
                y_offset = y_delta / distance * offset
                x_offsets[source] -= x_offset
                y_offsets[source] -= y_offset
                x_offsets[target] += x_offset
                y_offsets[target] += y_offset
        x_offset_sum = 0
        y_offset_sum = 0
        for vertex in vertices[group]:
            x_offset_sum += abs(x_offsets[vertex])
            y_offset_sum += abs(y_offsets[vertex])
        if x_offset_sum < 1e-5 and y_offset_sum < 1e-5:
            break
        for vertex in vertices[group]:
            xs[vertex] += x_offsets[vertex]
            ys[vertex] += y_offsets[vertex]
    x_base = (random.random() - 0.5) * 30
    y_base = (random.random() - 0.5) * 30
    for vertex in vertices[group]:
        layouts[vertex] = (x_base + xs[vertex], y_base + ys[vertex])

records = []
for vertex in layouts:
    records.append((vertex, layouts[vertex][0], layouts[vertex][1]))

cursor.execute('create table vertex_layout (vertex_id int, x double, y double)')
connection.commit()

cursor.executemany('insert into vertex_layout values (%s, %s, %s)', records)
connection.commit()

cursor.execute('select source_id, target_id, category from edge_group')
select_records = cursor.fetchall()

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

cursor.execute('create table edge_layout (source_id int, target_id int, category varchar(11), x_1 double, y_1 double, x\
_2 double, y_2 double, x_3 double, y_3 double, x_4 double, y_4 double, x_5 double, y_5 double, x_6 double, y_6 double, \
x_7 double, y_7 double)')
connection.commit()

cursor.executemany('insert into edge_layout values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
                   , insert_records)
connection.commit()

cursor.close()
connection.close()
