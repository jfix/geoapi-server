# Geo-API server

Tiny expressjs server that accepts `GET` requests with an `ip` query parameter and returns a JSON document with the info it found.

https://xxxxxxxxx.herokuapp.com/?ip=1.1.1.1 

returns 

```
{
  "continent": {
    "code": "AS",
    "geoname_id": 6255147,
    "names": {
      "de": "Asien",
      "en": "Asia",
      "es": "Asia",
      "fr": "Asie",
      "ja": "アジア",
      "pt-BR": "Ásia",
      "ru": "Азия",
      "zh-CN": "亚洲"
    }
  },
  "country": {
    "geoname_id": 1814991,
    "iso_code": "CN",
    "names": {
      "de": "China",
      "en": "China",
      "es": "China",
      "fr": "Chine",
      "ja": "中国",
      "pt-BR": "China",
      "ru": "Китай",
      "zh-CN": "中国"
    }
  },
  "location": {
    "accuracy_radius": 1000,
    "latitude": 34.7732,
    "longitude": 113.722,
    "time_zone": "Asia/Shanghai"
  },
  "registered_country": {
    "geoname_id": 1814991,
    "iso_code": "CN",
    "names": {
      "de": "China",
      "en": "China",
      "es": "China",
      "fr": "Chine",
      "ja": "中国",
      "pt-BR": "China",
      "ru": "Китай",
      "zh-CN": "中国"
    }
  }
}
```

In case of errors (missing or wrong IP address), an HTTP error `400` is returned as well as a JSON document like this one:

```
{
  "error": "Not a valid IP address"
}
```

The Heroku deployment uses an additional buildpack to retrieve the MMDB MaxMind databases (with two env vars defined in the Heroku backoffice) from the MaxMind website.

The additional buildback is here: https://github.com/mantisadnetwork/heroku-buildpack-maxmind It makes sure that for each deployment the required MaxMind databases (City and Country) are downloaded if the present ones are older than one week (MaxMind updates its data every week on Tuesdays).

## Todo

- [ ] Add some kind of protection against abuse of the service (apart from the difficult to guess domain name)