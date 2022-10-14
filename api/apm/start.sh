#!/bin/bash
export ELK_VERSION=7.10.2

## ELASTIC
docker network create elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch:$ELK_VERSION
docker run -d --name es01-test --net elastic -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 \
-e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:$ELK_VERSION

## KIBANA
docker pull docker.elastic.co/kibana/kibana:$ELK_VERSION
docker run  --name kib01-test --net elastic -p 127.0.0.1:5601:5601 \
-e "ELASTICSEARCH_HOSTS=http://es01-test:9200" docker.elastic.co/kibana/kibana:$ELK_VERSION

## APM SERVER
docker run  -p 8200:8200 \
--net elastic \
--name=apm-server --user=apm-server \
--volume="$(pwd)/apm-server.docker.yml:/usr/share/apm-server/apm-server.yml:ro" \
docker.elastic.co/apm/apm-server:$ELK_VERSION \
--strict.perms=false -e
