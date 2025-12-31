query_organizations = ["Test Org", "Test Org 3"]
rsu_set_for_org_query_statement: tuple[str, dict] = (
    (
        "SELECT rsu.ipv4_address::text AS ipv4_address "
        "FROM cvmanager.rsus rsu "
        "JOIN cvmanager.rsu_organization AS rsu_org ON rsu_org.rsu_id = rsu.rsu_id "
        "JOIN cvmanager.organizations AS org ON org.organization_id = rsu_org.organization_id "
        "WHERE org.name IN (:item_0, :item_1)"
    ),
    {"item_0": "Test Org", "item_1": "Test Org 3"},
)

rsu_query_return = [
    ["1.1.1.1/32"],
    ["1.1.1.2/32"],
    ["1.1.1.3/32"],
]
rsu_query_statement: tuple[str, dict] = (
    (
        "SELECT rsu.ipv4_address::text AS ipv4_address "
        "FROM cvmanager.rsus rsu "
        "JOIN cvmanager.rsu_organization AS rsu_org ON rsu_org.rsu_id = rsu.rsu_id "
        "JOIN cvmanager.organizations AS org ON org.organization_id = rsu_org.organization_id "
        "WHERE org.name IN (:item_0) AND rsu.ipv4_address = :rsu_ip"
    ),
    {"rsu_ip": "1.1.1.1", "item_0": "a"},
)

intersection_query_return = [
    ["1"],
    ["2"],
    ["3"],
]
intersection_query_statement: tuple[str, dict] = (
    (
        "SELECT intersection.intersection_number as intersection_number "
        "FROM cvmanager.intersections intersection "
        "JOIN cvmanager.intersection_organization AS intersection_org ON intersection_org.intersection_id = intersection.intersection_id "
        "JOIN cvmanager.organizations AS org ON org.organization_id = intersection_org.organization_id "
        "WHERE org.name IN (:item_0) AND intersection.intersection_number = :intersection_id"
    ),
    {"intersection_id": "1", "item_0": "a"},
)

user_query_return = [
    ["test1@gmail.com"],
]
user_query_statement: tuple[str, dict] = (
    (
        "SELECT u.email as email "
        "FROM cvmanager.users u "
        "JOIN cvmanager.user_organization AS user_org ON user_org.user_id = u.user_id "
        "JOIN cvmanager.organizations AS org ON org.organization_id = user_org.organization_id "
        "WHERE org.name IN (:item_0) AND u.email = :user_email"
    ),
    {"user_email": "test1@gmail.com", "item_0": "a"},
)
