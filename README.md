# Basic FPS set in Nyirmartonfalva's controversial canopy project

FPS based on https://github.com/mohsenheydari/three-fps with the model of the area provided by https://github.com/szabokrissz96/lombkorona

## Usage

Select a difficulty on the first screen.

Keyboard & mouse:
* `W`, `A`, `S`, `D`: move
* Mouse: look
* `R`: reload
* `Space`: jump

Touchscreen:
* First touch: look
* Second and further touches:
 * Top left section: fire
 * Bottom left section: jump
 * Top right section: move forward
 * Bottom right section: move backward

Enemies respawn after killed. There are no end goals, and no win or lose conditions.

## Install
Simply clone and run `npm install`:

```bash
git clone https://github.com/sztupy/lombkorona.git lombkorona
cd lombkorona
npm install
```

## Running the development server
To see the changes you make to the project go to the project's folder in terminal and type...

```bash
npm start
```

This command will bundle the project code and start a development server at [http://localhost:8080/](http://localhost:8080/). Visit this in your web browser.

## Building the project for the web
Running `npm run build` in terminal will bundle your project into the folder `./docs/`. This can be uploaded to GitHub Pages amond others for distribution.

## About the models
Art assets used in this project:

* [Nyirmartonfalva canopy](https://github.com/szabokrissz96/lombkorona) by [szabokrissz96](https://github.com/szabokrissz96)
* [Ak47](https://skfb.ly/6UEL9) by [kursat_sokmen](https://sketchfab.com/kursat_sokmen) is licensed under CC BY 4.0
* [Metal Ammo Box](https://skfb.ly/6UAQY) by [TheoClarke](https://sketchfab.com/TheoClarke) is licensed under CC BY 4.0
* [Mutant](https://mixamo.com) by [mixamo.com](https://mixamo.com)
* [Veld Fire](https://hdrihaven.com/hdri/?h=veld_fire) by [Greg Zaal](https://hdrihaven.com/hdris/?a=Greg%20Zaal) is licensed under CC0
* Sound effects from [Pixabay](https://pixabay.com/)

## Thanks to
* [Three Seed](https://github.com/edwinwebb/three-seed)
* [ammo.js](https://github.com/kripken/ammo.js/)
* [three-pathfinding](https://github.com/donmccurdy/three-pathfinding)

## License
[MIT](https://github.com/sztupy/lombkorona/blob/master/LICENSE)
