import mysql.connector
from flask import Flask, redirect, request, jsonify
from pypinyin import pinyin, lazy_pinyin, Style

web = Flask(__name__)


@web.route('/')
def main():
    return redirect('static/main.html')

@web.route('/three_affiliated_groups')
def three_affiliated_groups():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_1 = connection_2.cursor()

    # 根据可疑组id 查找嫌疑群体的所有节点
    group_id = request.args.get('group_id', -1)
    group_id = request.args.get('group_id', -1)

    cursor_1.execute("SELECT vertex_id, enterprise_detail.enterprise_id,enterprise_detail.electronic_archive_number,enterprise_detail.name from (\
    SELECT vertex_group.vertex_id ,vertex.category,vertex.enterprise_id FROM vertex_group left join vertex on vertex_group.vertex_id = vertex.id\
    where affiliated_id = %s and category = 'enterprise') as a left join enterprise_detail on a.enterprise_id = enterprise_detail.enterprise_id;" %group_id)
    records = cursor_1.fetchall()
    print(records)
    # data = {}
    # data["group"] = []
    data = []
    # name = []
    for enterprise in records:
            data.append((enterprise[0], enterprise[1], str(enterprise[2]), " ".join(map(lambda s: s.capitalize(), lazy_pinyin(enterprise[3])))))
    print(data)
    # print(len(group))
    cursor_1.close()
    return jsonify(data)


@web.route('/three_affiliated')
def three_affiliated():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    #获取了所有的三角的节点
    cursor_1 = connection_2.cursor()
    cursor_2 = connection_2.cursor()

    data = []
    group = []

    # 获取了所有的三角的节点及人名
    cursor_1.execute("select id,name from (SELECT three_affiliated_id FROM network.vertex_group where three_affiliated_id is not null \
group by three_affiliated_id limit 5) as c left join ( select a.id,name from (select *from vertex where vertex.category = 'person ')as a \
left join (select * from person_detail) as b on a.person_id = b.person_id ) as d on c.three_affiliated_id = d.id")
    person_vertices = cursor_1.fetchall()
    person_vertices[0] = (70472, "XuJian")

    print(person_vertices);

    for vertex in person_vertices:
        group = []
        group.append(vertex[0])
        group.append(" ".join(map(lambda s:s.capitalize(),lazy_pinyin(vertex[1]))))
        cursor_2.execute("SELECT vertex_id, enterprise_detail.enterprise_id, enterprise_detail.electronic_archive_number, enterprise_detail.name from (\
    SELECT vertex_group.vertex_id ,vertex.category,vertex.enterprise_id FROM vertex_group left join vertex on vertex_group.vertex_id = vertex.id\
    where three_affiliated_id = %s and category = 'enterprise') as a left join enterprise_detail on a.enterprise_id = enterprise_detail.enterprise_id;" %vertex[0])
        enterprise_vertices = cursor_2.fetchall()
        for enterprise in enterprise_vertices:
            group.append(enterprise[0])
            group.append(" ".join(map(lambda s:s.capitalize(),lazy_pinyin(enterprise[3]))))
            print("group", group)
        data.append(group)
    print("data", data)



#     cursor_1.execute("SELECT three_affiliated_id FROM network.vertex_group where three_affiliated_id is not null limit 30")
#     records = cursor_1.fetchall()
#
#     data = {}
#     data["group"] = []
#     group_id = []
#     name = []
#     for vertex in records:
#         if vertex[0] not in group_id:
#             cursor_2.execute("select name from (select *from vertex where vertex.category = 'person ')as a \
# left join (select * from person_detail) as b on a.person_id = b.person_id where id = %s" % vertex[0])
#             name_source = cursor_2.fetchall()
#             group_id.append(vertex[0])
#             name.append(" ".join(map(lambda s: s.capitalize(), lazy_pinyin(name_source[0][0]))))
#             data["group"].append((vertex[0], " ".join(map(lambda s: s.capitalize(), lazy_pinyin(name_source[0][0])))))


    cursor_1.close()
    cursor_2.close()
    connection_2.close()
    return jsonify(data)



@web.route('/network')
def network():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()

    x_lower_bound = request.args.get('x_lower_bound', 0)
    x_upper_bound = request.args.get('x_upper_bound', 0)
    y_lower_bound = request.args.get('y_lower_bound', 0)
    y_upper_bound = request.args.get('y_upper_bound', 0)

    data = {}

    cursor_2.execute('select edge_layout.source_id, edge_layout.target_id, edge_layout.category, edge_layout.x_1, edge_\
layout.y_1, edge_layout.x_2, edge_layout.y_2, edge_layout.x_3, edge_layout.y_3, edge_layout.x_4, edge_layout.y_4, edge_\
layout.x_5, edge_layout.y_5, edge_layout.x_6, edge_layout.y_6, edge_layout.x_7, edge_layout.y_7, edge_group_2.group_id,\
edge_group_2.isAffiliated , edge_group_2.affiliated_id, edge_group_2.is_three_affiliated, edge_group_2.three_affiliated_id from edge_layout, edge_group_2,\
 vertex_layout where edge_layout.source_id = edge_group_2.source_id and edge_layout.target_id = edge_group_2.target_id \
 and edge_layout.category = edge_group_2.category and edge_group_2.group_id is not null and edge_layo\
ut.source_id = vertex_layout.vertex_id and vertex_layout.x > %s and vertex_layout.x < %s and vertex_layout.y > %s and v\
ertex_layout.y < %s union select edge_layout.source_id, edge_layout.target_id, edge_layout.category, edge_layout.x_1, e\
dge_layout.y_1, edge_layout.x_2, edge_layout.y_2, edge_layout.x_3, edge_layout.y_3, edge_layout.x_4, edge_layout.y_4, e\
dge_layout.x_5, edge_layout.y_5, edge_layout.x_6, edge_layout.y_6, edge_layout.x_7, edge_layout.y_7, edge_group_2.group_i\
d, edge_group_2.isAffiliated, edge_group_2.affiliated_id ,edge_group_2.is_three_affiliated, edge_group_2.three_affiliated_id from edge_layout, edge_group_2, vertex_layout where edge_layout.source_id = edge_group_2.source_id and edge_layout.target\
_id = edge_group_2.target_id and edge_layout.category = edge_group_2.category and edge_group_2.group_id is not null and edge_\
layout.target_id = vertex_layout.vertex_id and vertex_layout.x > %s and vertex_layout.x < %s and vertex_layout.y > %s a\
nd vertex_layout.y < %s', (x_lower_bound, x_upper_bound, y_lower_bound, y_upper_bound, x_lower_bound, x_upper_bound,
                           y_lower_bound, y_upper_bound))
    data['edges'] = cursor_2.fetchall()


    cursor_2.execute('select vertex_layout.vertex_id, vertex_layout.x, vertex_layout.y, vertex_group.group_id, vertex.c\
ategory, vertex_group.isAffiliated, vertex_group.affiliated_id,vertex_group.is_three_affiliated, vertex_group.three_affiliated_id from vertex_layout, vertex_group, vertex where vertex_layout.x > %s and vertex_layout.x < %s and vertex_layout.\
y > %s and vertex_layout.y < %s and vertex_layout.vertex_id = vertex_group.vertex_id and vertex_layout.vertex_id = vert\
ex.id', (x_lower_bound, x_upper_bound, y_lower_bound, y_upper_bound))
    data['vertices'] = cursor_2.fetchall()
    cursor_2.close()
    connection_2.close()

    return jsonify(data)


@web.route('/enterprise_detail')
def enterprise_detail():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()

    vertex_id = request.args.get('vertex_id', -1)

    cursor_2.execute('select vertex.enterprise_id, enterprise_detail.electronic_archive_number, enterprise_detail.name,\
 enterprise_detail.industry from vertex, enterprise_detail where vertex.id = %s and vertex.enterprise_id = enterprise_d\
etail.enterprise_id', [vertex_id])
    record = cursor_2.fetchone()

    # if record:
    #     data = (record[0], str(record[1]), record[2], record[3])
    if record:
        data = (record[0], str(record[1]), record[2], record[3])
        # print(str(lazy_pinyin(record[2])));
        print(" ".join(map(lambda s: s.capitalize(), lazy_pinyin(record[2]))));
        # print(" ".join(map(lambda s: s.capitalize(), lazy_pinyin(record[3]))));

        data = (record[0],  str(record[1]), " ".join(map(lambda s:s.capitalize(),lazy_pinyin(record[2]))), " ".join(map(lambda s:s.capitalize(),lazy_pinyin(record[3]))))
    else:
        data = None

    cursor_2.close()
    connection_2.close()

    return jsonify(data)


@web.route('/person_detail')
def person_detail():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()

    vertex_id = request.args.get('vertex_id', -1)

    cursor_2.execute('select vertex.person_id, person_detail.name from vertex, person_detail where vertex.id = %s and v\
ertex.person_id = person_detail.person_id', [vertex_id])
    record = cursor_2.fetchone()
    print(record)
    if record:
        data = (record[0], " ".join(map(lambda s: s.capitalize(), lazy_pinyin(record[1]))))
    else:
        data = None
    print(data)
    cursor_2.close()
    connection_2.close()
    return jsonify(data)


@web.route('/transaction_detail')
def transaction_detail():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()

    source_id = request.args.get('source_id', -1)
    target_id = request.args.get('target_id', -1)

    cursor_2.execute("select transaction_amount, transaction_number from edge where source_id = %s and target_id = %s a\
nd category = 'transaction'", (source_id, target_id))
    record = cursor_2.fetchone()

    if record:
        data = (str(record[0]), str(record[1]))
    else:
        data = None

    cursor_2.close()
    connection_2.close()

    return jsonify(data)


@web.route('/investment_detail')
def investment_detail():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()

    source_id = request.args.get('source_id', -1)
    target_id = request.args.get('target_id', -1)

    cursor_2.execute("select investment_proportion from edge where source_id = %s and target_id = %s and category = 'in\
vestment'", (source_id, target_id))
    record = cursor_2.fetchone()

    if record:
        data = str(record[0])
    else:
        data = None

    cursor_2.close()
    connection_2.close()

    return jsonify(data)


@web.route('/search_vertex')
def search_vertex():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()
    vertex_id = request.args.get('vertex_id', '')
    cursor_2.execute('select  vertex_layout.x, vertex_layout.y, vertex_id from  vertex_layout where vertex_id = %s' % vertex_id)
    data = cursor_2.fetchall()
    cursor_2.close()
    connection_2.close()

    return jsonify(data)

@web.route('/search')
def search():
    connection_2 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170',
                                           database='network')
    cursor_2 = connection_2.cursor()

    name = request.args.get('enterprise_name', '')
    vertex_id = request.args.get('vertex_id', '')
    print(vertex_id)
    if vertex_id:
        cursor_2.execute('select enterprise_detail.name, vertex_layout.x, vertex_layout.y, vertex.id from enterprise_detail\
                , vertex, vertex_layout where vertex_layout.vertex_id = %s and enterprise_detail.enterprise_id = vertex.enterprise_id\
                 and vertex.id = vertex_layout.vertex_id' % vertex_id)

    else:
        cursor_2.execute('select enterprise_detail.name, vertex_layout.x, vertex_layout.y, vertex.id from enterprise_detail\
        , vertex, vertex_layout where enterprise_detail.name like %s and enterprise_detail.enterprise_id = vertex.enterprise_id\
         and vertex.id = vertex_layout.vertex_id', ['%' + name + '%'])

    data = cursor_2.fetchall()

    cursor_2.close()
    connection_2.close()

    return jsonify(data)


connection_1 = mysql.connector.connect(user='network', password='taxgm2016', host='192.168.16.170', database='network')
cursor_1 = connection_1.cursor()

cursor_1.execute("show index from vertex_layout where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table vertex_layout add index `1` (x, y)')
    connection_1.commit()

cursor_1.execute("show index from vertex_group where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table vertex_group add index `1` (vertex_id)')
    connection_1.commit()

cursor_1.execute("show index from vertex where key_name = '3'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table vertex add index `3` (id)')
    connection_1.commit()

cursor_1.execute("show index from edge_layout where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table edge_layout add index `1` (source_id, target_id, category)')
    connection_1.commit()

cursor_1.execute("show index from edge_group_2 where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table edge_group_2 add index `1` (source_id, target_id, category)')
    connection_1.commit()

cursor_1.execute("show index from edge_layout where key_name = '2'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table edge_layout add index `2` (source_id)')
    connection_1.commit()

cursor_1.execute("show index from edge_layout where key_name = '3'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table edge_layout add index `3` (target_id)')
    connection_1.commit()

cursor_1.execute("show index from enterprise_detail where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table enterprise_detail add index `1` (enterprise_id)')
    connection_1.commit()

cursor_1.execute("show index from person_detail where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table person_detail add index `1` (person_id)')
    connection_1.commit()

cursor_1.execute("show index from edge where key_name = '1'")
records = cursor_1.fetchall()
if len(records) == 0:
    cursor_1.execute('alter table edge add index `1` (source_id, target_id, category)')
    connection_1.commit()

cursor_1.close()
connection_1.close()

web.config['JSON_AS_ASCII'] = False
web.run('localhost', 80)
