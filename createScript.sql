create database nodesql;

use nodesql;

CREATE TABLE contacts (
    id INT AUTO_INCREMENT,
    login VARCHAR(255) UNIQUE,
    creation_date Date,
    name VARCHAR(255),
    PRIMARY KEY (id)
);