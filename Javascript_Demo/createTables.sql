CREATE TABLE IF NOT EXISTS Hardware (
    HardwareID INTEGER PRIMARY KEY,
    Description TEXT,
    Type TEXT,
    Quantity INTEGER
);

CREATE TABLE IF NOT EXISTS Suppiler (
    SuppilerID INTEGER PRIMARY KEY,
    Name TEXT,
    Phone TEXT,
    Email TEXT
);

CREATE TABLE IF NOT EXISTS User (
    UserID INTEGER PRIMARY KEY,
    Email TEXT,
    Username TEXT,
    Password TEXT,
    Credit INTEGER, -- Amount of credit/money user has in account
    Permission TEXT, -- Possible Permission values: Customer, Store Clerk, Store Manager, Suppiler. Visitors will not be in this table because they are not registered users
    StrikeLvl INTEGER, -- Records the number of strikes this user has, having a StrikeLvl of 3 suspends said user
    IsSuspended BOOL -- Boolean that determines if the user is suspended
);

CREATE TABLE IF NOT EXISTS AvoidList (
    Email TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Threads (
    PostID INTEGER PRIMARY KEY,
    UserID TEXT FOREIGN KEY,
    Message TEXT
);

CREATE TABLE IF NOT EXISTS Comments (
    PostID INTEGER FOREIGN KEY,
    UserID TEXT FOREIGN KEY,
    Message TEXT
);