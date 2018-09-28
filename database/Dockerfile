FROM mysql/mysql-server:5.7.22 

RUN mkdir -p /mysql/data/
WORKDIR /mysql/
COPY ./ ./
COPY data /var/lib/mysql-files/
RUN chmod +x ./db_setup.sh