# Geo-API server

Tiny expressjs server that returns geographical information for an IP address.

The server will attempt to find the IP address in this order:

1. a provided `ip` query parameter
2. the `X-Forwarded-For` header (using the `forwarded` npm package to detect client addresses behind proxies)
3. the `ip` value as provided via the `request` object (but it may be a proxy IP address)
4. first item from the `request.ips[0]` array

You can therefore call the API in one of these two ways:

- City-level information: https://xxxxxxxxx.herokuapp.com/city?ip=126.0.0.1
- Country-level only: https://xxxxxxxxx.herokuapp.com/country=126.0.0.1
- Same as city-level: https://xxxxxxxxx.herokuapp.com/?ip=126.0.0.1
- Same as city-level, IP taken from HTTP request: https://xxxxxxxxx.herokuapp.com/

returns something like the following JSON (note that the `city`, `subdivisions`, `location` and `postal` objects do not seem to be guaranteed, `continent`, `country` and `registered_country` objects however seem to be always present). Note that the actual geographic information is contained in the `data` object. There are currently two other values transmitted: `ip` and `durationMs`.

```
{
  "data": {
    "city": {
      "geoname_id": 2146142,
      "names": {
        "de": "Townsville",
        "en": "Townsville",
        "es": "Townsville",
        "fr": "Townsville",
        "ja": "タウンズビル",
        "pt-BR": "Townsville",
        "ru": "Таунсвилл",
        "zh-CN": "汤斯维尔"
      }
    },
    "continent": {
      "code": "OC",
      "geoname_id": 6255151,
      "names": {
        "de": "Ozeanien",
        "en": "Oceania",
        "es": "Oceanía",
        "fr": "Océanie",
        "ja": "オセアニア",
        "pt-BR": "Oceania",
        "ru": "Океания",
        "zh-CN": "大洋洲"
      }
    },
    "country": {
      "geoname_id": 2077456,
      "iso_code": "AU",
      "names": {
        "de": "Australien",
        "en": "Australia",
        "es": "Australia",
        "fr": "Australie",
        "ja": "オーストラリア",
        "pt-BR": "Austrália",
        "ru": "Австралия",
        "zh-CN": "澳大利亚"
      }
    },
    "location": {
      "accuracy_radius": 100,
      "latitude": -19.2634,
      "longitude": 146.8059,
      "time_zone": "Australia/Brisbane"
    },
    "postal": {
      "code": "4810"
    },
    "registered_country": {
      "geoname_id": 2077456,
      "iso_code": "AU",
      "names": {
        "de": "Australien",
        "en": "Australia",
        "es": "Australia",
        "fr": "Australie",
        "ja": "オーストラリア",
        "pt-BR": "Austrália",
        "ru": "Австралия",
        "zh-CN": "澳大利亚"
      }
    },
    "subdivisions": [
      {
        "geoname_id": 2152274,
        "iso_code": "QLD",
        "names": {
          "en": "Queensland",
          "pt-BR": "Queensland",
          "ru": "Квинсленд"
        }
      }
    ]
  },
  "ip": "121.0.0.1",
  "durationMs": 67
}
```

In case of errors (missing or wrong IP address), an HTTP error `400` is returned as well as a JSON document like this one:

```
{
  "error": "Not a valid IP address"
}
```

## Deployment

In brief, there are two types of deployment:
1. When you change the code and commit it to the `main` branch, Heroku will automatically trigger a deployment.
2. Every Wednesday morning, a GitHub Actions deployment is triggered via the `schedule` trigger.

The Heroku deployment uses an additional buildpack to retrieve the MMDB MaxMind databases (with two env vars defined in the Heroku backoffice) from the MaxMind website. The additional buildback is here: https://github.com/mantisadnetwork/heroku-buildpack-maxmind It makes sure that for each deployment the required MaxMind databases (City and Country) are downloaded if the present ones are older than one week (MaxMind updates its data every week on Tuesdays).

## Todo list

- [ ] Add some kind of protection against abuse of the service (apart from the difficult to guess domain name)
- [ ] Improve response time, at least for caching (via Redis)
