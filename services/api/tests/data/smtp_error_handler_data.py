import multidict


##################################### test_data ###########################################
get_subscribed_users_query = (
    "SELECT email FROM cvmanager.users WHERE receive_error_emails = '1'"
)
get_subscribed_users_query_resp = [
    {"email": "test@gmail.com"},
    {"email": "test2@gmail.com"},
]

get_unsubscribe_user_query = (
    "SELECT receive_error_emails FROM cvmanager.users WHERE email = 'test@gmail.com'"
)
get_unsubscribe_user_remove_query = (
    "UPDATE cvmanager.users SET receive_error_emails='0' WHERE email = 'test@gmail.com'"
)

subscribed_user_emails = ["test1@gmail.com", "test2@gmail.com"]
html_email_template = """<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CV Manager API Error Email</title>
    <meta name="generator" content="Google Web Designer 15.2.1.0306" />
    <style id="gwd-text-style">
      p {
        margin: 0;
      }
      h1 {
        margin: 0;
      }
      h2 {
        margin: 0;
      }
      h3 {
        margin: 0;
      }
    </style>
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      body {
        background-color: transparent;
        transform: perspective(1400px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform-style: preserve-3d;
      }
      body * {
        transform-style: preserve-3d;
      }
    </style>
  </head>
  <body>
    <p>
      You are receiving this email because your user is marked to receive error emails on the CV Manager Admin page.
    </p>
    <br />
    <p>This error originated in the ##_ENVIRONMENT_## environment CV Manager API</p>
    <br />
    <p>Error Message: ##_ERROR_MESSAGE_##</p>
    <br />
    <p>Error occurred at: ##_ERROR_TIME_##</p>
    <br />
    <p>View this error in Logs: <a href="##_LOGS_LINK_##">rsu-manager-api logs</a></p>
    <br />
    <p>--</p>
    <p>
      If you no longer wish to receive these emails, please uncheck the "receive error emails" checkbox on the CV
      manager portal Admin page, or use this link to unsubscribe: <a href="##_UNSUBSCRIBE_LINK_##">unsubscribe</a>
    </p>
  </body>
</html>
"""

html_email_body_1 = """<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CV Manager API Error Email</title>
    <meta name="generator" content="Google Web Designer 15.2.1.0306" />
    <style id="gwd-text-style">
      p {
        margin: 0;
      }
      h1 {
        margin: 0;
      }
      h2 {
        margin: 0;
      }
      h3 {
        margin: 0;
      }
    </style>
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      body {
        background-color: transparent;
        transform: perspective(1400px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform-style: preserve-3d;
      }
      body * {
        transform-style: preserve-3d;
      }
    </style>
  </head>
  <body>
    <p>
      You are receiving this email because your user is marked to receive error emails on the CV Manager Admin page.
    </p>
    <br />
    <p>This error originated in the ENVIRONMENT environment CV Manager API</p>
    <br />
    <p>Error Message: 2023-09-15 00:00:00,000000</p>
    <br />
    <p>Error occurred at: ERROR_TIME</p>
    <br />
    <p>View this error in Logs: <a href="LOGS_LINK">rsu-manager-api logs</a></p>
    <br />
    <p>--</p>
    <p>
      If you no longer wish to receive these emails, please uncheck the "receive error emails" checkbox on the CV
      manager portal Admin page, or use this link to unsubscribe: <a href="http://unsubscribe-test1@gmail.com">unsubscribe</a>
    </p>
  </body>
</html>
"""

html_email_body_2 = """<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CV Manager API Error Email</title>
    <meta name="generator" content="Google Web Designer 15.2.1.0306" />
    <style id="gwd-text-style">
      p {
        margin: 0;
      }
      h1 {
        margin: 0;
      }
      h2 {
        margin: 0;
      }
      h3 {
        margin: 0;
      }
    </style>
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      body {
        background-color: transparent;
        transform: perspective(1400px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform-style: preserve-3d;
      }
      body * {
        transform-style: preserve-3d;
      }
    </style>
  </head>
  <body>
    <p>
      You are receiving this email because your user is marked to receive error emails on the CV Manager Admin page.
    </p>
    <br />
    <p>This error originated in the ENVIRONMENT environment CV Manager API</p>
    <br />
    <p>Error Message: 2023-09-15 00:00:00,000000</p>
    <br />
    <p>Error occurred at: ERROR_TIME</p>
    <br />
    <p>View this error in Logs: <a href="LOGS_LINK">rsu-manager-api logs</a></p>
    <br />
    <p>--</p>
    <p>
      If you no longer wish to receive these emails, please uncheck the "receive error emails" checkbox on the CV
      manager portal Admin page, or use this link to unsubscribe: <a href="http://unsubscribe-test2@gmail.com">unsubscribe</a>
    </p>
  </body>
</html>
"""
