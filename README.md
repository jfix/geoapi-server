# Geo-API server

Tiny expressjs server that accepts `GET` requests with an `ip` query parameter and returns a JSON document with the info it found.

https://xxxxxxxxx.herokuapp.com/?ip=126.0.0.1

returns something like this (note that the `city`, `subdivisions`, `location` and `postal` objects do not seem to be guaranteed, `continent`, `country` and `registered_country` objects however seem to be always present):

```
{
  "city": {
    "geoname_id": 1851510,
    "names": {
      "de": "Suginami",
      "en": "Suginami-ku",
      "es": "Suginami",
      "fr": "Suginami",
      "ja": "杉並区",
      "pt-BR": "Suginami"
    }
  },
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
    "geoname_id": 1861060,
    "iso_code": "JP",
    "names": {
      "de": "Japan",
      "en": "Japan",
      "es": "Japón",
      "fr": "Japon",
      "ja": "日本",
      "pt-BR": "Japão",
      "ru": "Япония",
      "zh-CN": "日本"
    }
  },
  "location": {
    "accuracy_radius": 20,
    "latitude": 35.6827,
    "longitude": 139.6138,
    "time_zone": "Asia/Tokyo"
  },
  "postal": {
    "code": "168-0071"
  },
  "registered_country": {
    "geoname_id": 1861060,
    "iso_code": "JP",
    "names": {
      "de": "Japan",
      "en": "Japan",
      "es": "Japón",
      "fr": "Japon",
      "ja": "日本",
      "pt-BR": "Japão",
      "ru": "Япония",
      "zh-CN": "日本"
    }
  },
  "subdivisions": [
    {
      "geoname_id": 1850144,
      "iso_code": "13",
      "names": {
        "en": "Tokyo",
        "fr": "Préfecture de Tokyo",
        "ja": "東京都"
      }
    }
  ]
}
```

In case of errors (missing or wrong IP address), an HTTP error `400` is returned as well as a JSON document like this one:

```
{
  "error": "Not a valid IP address"
}
```

## Deployment

Deployment is automatic via commit to the `main` branch.

The Heroku deployment uses an additional buildpack to retrieve the MMDB MaxMind databases (with two env vars defined in the Heroku backoffice) from the MaxMind website.

The additional buildback is here: https://github.com/mantisadnetwork/heroku-buildpack-maxmind It makes sure that for each deployment the required MaxMind databases (City and Country) are downloaded if the present ones are older than one week (MaxMind updates its data every week on Tuesdays).

## Todo

- [ ] Add some kind of protection against abuse of the service (apart from the difficult to guess domain name)