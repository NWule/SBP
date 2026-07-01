# Prva verzija šeme baze podataka

Prva verzija šeme baze podataka se potpuno poklapa sa strukturom skupa podataka i sastoji se iz dve kolekcije, *recpies* i *reviews*.

### Kolekcija **Recipes**

Svaki dokument u kolekciji *recipes* predstavlja jedan zapis o receptu koji je korisnik napravio na sajtu **Food.com** i odgovara jednom redu u **recipes.csv**

Primer jednog dokumenta: <br> ![](./recipes.png?raw=true)

### Kolekcija **Reviews**

Svaki dokument u ovoj kolekciji predstavlja jednu recenziju koju je korisnik ostavio za neki recept. Svaki dokument odgovara jednom redu iz **reviews.csv**. Povezani su sa *recipes* preko polja "RecipeId".

Primer jednog dukumenta: <br> ![](./reviews.png?raw=true)