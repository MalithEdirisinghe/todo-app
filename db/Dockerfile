# Use official MySQL image
FROM mysql:8.0

# Set MySQL database and allow empty password
ENV MYSQL_DATABASE=todos
ENV MYSQL_RANDOM_ROOT_PASSWORD=yes

# Copy initialization SQL scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Set default authentication plugin
CMD ["--default-authentication-plugin=mysql_native_password"]

# Expose MySQL port
EXPOSE 3306