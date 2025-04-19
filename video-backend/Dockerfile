FROM registry.access.redhat.com/ubi8/openjdk-21:1.20

WORKDIR /deployments

COPY --chown=185 target/quarkus-app/lib /deployments/lib/
COPY --chown=185 target/quarkus-app/app /deployments/app/
COPY --chown=185 target/quarkus-app/quarkus /deployments/quarkus/
COPY --chown=185 target/quarkus-app/*-runner.jar /deployments/

EXPOSE 8080

CMD ["java", "-jar", "/deployments/*-runner.jar"]
