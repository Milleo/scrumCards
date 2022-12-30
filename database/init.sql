CREATE DATABASE IF NOT EXISTS scrum_cards;
/* @TODO Make the proper GRANT for this user
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, REFERENCES ON scrum_cards.* TO 'scrum_cards_user_1'@'%' WITH GRANT OPTION; */
/GRANT ALL ON scrum_cards.* TO 'scrum_cards_user_1'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;