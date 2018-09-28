# soen-343
SOEN 343 - Team 3 Repo

## Development Setup
1. Install Docker
2. Clone the repo: `git clone https://github.com/justin-cotarla/soen-343.git`
3. Start Docker from the project root: `docker-compose up --build`

## Database setup and teardown
The database volume is persisted when the docker containers are shut down. To completely
clear the database and its content, run `docker-compose down -v`.

To setup the database and preload it with data, start docker, wait for the database container
to fully initialize, and run `docker-compose exec database ./db_setup.sh`.

## Members
- Justin Cotarla - 40027609 (Team lead)
- Irina Fakotakis - 40029185
- Jeremiah-David Wreh - 40028325
- Derek Yu - 40022110
- Jamal Ghamraoui - 40027657
- Laura Wheatley - 40034960
- Zachary Bys - 40031629
- Georgik Barsemian - 40032101
- Krishna Patel - 40031019
- Dorin Rogov - 40031736