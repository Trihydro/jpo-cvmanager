import multidict

##################################### request data ###########################################

request_environ = multidict.MultiDict([])

request_args_good = {"org_name": "test org"}

request_args_bad = {"org_name": 5}

request_json_good = {
    "orig_name": "test org",
    "name": "test org",
    "users_to_add": [{"email": "test1@email.com", "role": "admin"}],
    "users_to_modify": [{"email": "test2@email.com", "role": "user"}],
    "users_to_remove": [{"email": "test3@email.com", "role": "user"}],
    "rsus_to_add": ["10.0.0.2"],
    "rsus_to_remove": ["10.0.0.1"],
}

request_json_bad = {
    "orig_name": "test org",
    "name": "test org",
    "users_to_add": [{"email": "test1@email.com", "role": "admin"}],
    "users_to_modify": [{"email": "test2@email.com", "role": "user"}],
    "rsus_to_add": ["10.0.0.2"],
    "rsus_to_remove": ["10.0.0.1"],
}

request_json_unsafe_input = {
    "orig_name": "test org",
    "name": "test org",
    "users_to_add": [{"email": "test1@email.com", "role": "admin"}],
    "users_to_modify": [{"email": "tes@t2@email.com", "role": "user"}],
    "users_to_remove": [{"email": "test3@email.com", "role": "operator"}],
    "rsus_to_add": ["10.0.0.2"],
    "rsus_to_remove": ["10.0.0.1"],
}

##################################### function data ###########################################

# get_all_orgs

get_all_orgs_pgdb_return = [
    ({"name": "test org", "num_users": 12, "num_rsus": 30},),
]

get_all_orgs_result = [{"name": "test org", "user_count": 12, "rsu_count": 30}]

get_all_orgs_sql = (
    "SELECT to_jsonb(row) "
    "FROM ("
    "SELECT org.name, "
    "(SELECT COUNT(*) FROM cvmanager.user_organization uo WHERE uo.organization_id = org.organization_id) num_users, "
    "(SELECT COUNT(*) FROM cvmanager.rsu_organization ro WHERE ro.organization_id = org.organization_id) num_rsus "
    "FROM cvmanager.organizations org"
    ") as row"
)

# get_org_data

get_org_data_user_return = [
    (
        {
            "email": "test@email.com",
            "first_name": "first",
            "last_name": "last",
            "role_name": "user",
        },
    ),
]

get_org_data_rsu_return = [
    ({"ipv4_address": "10.0.0.1", "primary_route": "test", "milepost": "test"},),
]

get_org_data_result = {
    "org_users": [
        {
            "email": "test@email.com",
            "first_name": "first",
            "last_name": "last",
            "role": "user",
        }
    ],
    "org_rsus": [{"ip": "10.0.0.1", "primary_route": "test", "milepost": "test"}],
}

get_org_data_user_sql = (
    "SELECT to_jsonb(row) "
    "FROM ("
    "SELECT u.email, u.first_name, u.last_name, u.name role_name "
    "FROM cvmanager.organizations AS org "
    "JOIN ("
    "SELECT uo.organization_id, users.email, users.first_name, users.last_name, roles.name "
    "FROM cvmanager.user_organization uo "
    "JOIN cvmanager.users ON uo.user_id = users.user_id "
    "JOIN cvmanager.roles ON uo.role_id = roles.role_id"
    ") u ON u.organization_id = org.organization_id "
    f"WHERE org.name = 'test org'"
    ") as row"
)

get_org_data_rsu_sql = (
    "SELECT to_jsonb(row) "
    "FROM ("
    "SELECT r.ipv4_address, r.primary_route, r.milepost "
    "FROM cvmanager.organizations AS org "
    "JOIN ("
    "SELECT ro.organization_id, rsus.ipv4_address, rsus.primary_route, rsus.milepost "
    "FROM cvmanager.rsu_organization ro "
    "JOIN cvmanager.rsus ON ro.rsu_id = rsus.rsu_id"
    ") r ON r.organization_id = org.organization_id "
    f"WHERE org.name = 'test org'"
    ") as row"
)

# get_allowed_selections

get_allowed_selections_return = [
    ({"name": "admin"},),
    ({"name": "user"},),
]

get_allowed_selections_result = {"user_roles": ["admin", "user"]}

get_allowed_selections_sql = (
    "SELECT to_jsonb(row) FROM (SELECT name FROM cvmanager.roles) as row"
)

# modify_org

modify_org_sql = (
    "UPDATE cvmanager.organizations SET " "name = 'test org' " "WHERE name = 'test org'"
)

modify_org_add_user_sql = (
    "INSERT INTO cvmanager.user_organization(user_id, organization_id, role_id) VALUES"
    " ("
    f"(SELECT user_id FROM cvmanager.users WHERE email = 'test1@email.com'), "
    f"(SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org'), "
    f"(SELECT role_id FROM cvmanager.roles WHERE name = 'admin')"
    ")"
)

modify_org_modify_user_sql = (
    "UPDATE cvmanager.user_organization "
    "SET role_id = (SELECT role_id FROM cvmanager.roles WHERE name = 'user') "
    "WHERE user_id = (SELECT user_id FROM cvmanager.users WHERE email = 'test2@email.com') "
    "AND organization_id = (SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org')"
)

modify_org_remove_user_sql = (
    "DELETE FROM cvmanager.user_organization WHERE "
    "user_id = (SELECT user_id FROM cvmanager.users WHERE email = 'test3@email.com') "
    "AND organization_id = (SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org')"
)

modify_org_add_rsu_sql = (
    "INSERT INTO cvmanager.rsu_organization(rsu_id, organization_id) VALUES"
    " ("
    "(SELECT rsu_id FROM cvmanager.rsus WHERE ipv4_address = '10.0.0.2'), "
    "(SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org')"
    ")"
)

modify_org_remove_rsu_sql = (
    "DELETE FROM cvmanager.rsu_organization WHERE "
    "rsu_id=(SELECT rsu_id FROM cvmanager.rsus WHERE ipv4_address = '10.0.0.1') "
    "AND organization_id=(SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org')"
)

# delete_org

delete_org_calls = [
    "DELETE FROM cvmanager.user_organization WHERE organization_id = (SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org')",
    "DELETE FROM cvmanager.rsu_organization WHERE organization_id = (SELECT organization_id FROM cvmanager.organizations WHERE name = 'test org')",
    "DELETE FROM cvmanager.organizations WHERE name = 'test org'",
]
