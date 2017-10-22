# js-machine-learning-sandbox
An assortment of exercises and works in progress dealing with machine learning in Javascript.

## Data Sets
The data sets used in testing are all publicly available online.

* Regression: [Advertising Dataset](http://www-bcf.usc.edu/~gareth/ISL/Advertising.csv), courtesy of Gareth James of USC
* KNN (k-Nearest Neighbour): [Iris Dataset](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data), courtesy of University of California, Irvine
* Temperature: Randomly generated internally
* MNIST digits: [MNIST Image Database](http://yann.lecun.com/exdb/mnist/)
* CIFAR-10 images: [CIFAR-10 and CIFAR-100 Datasets](http://www.cs.toronto.edu/~kriz/cifar.html)

All data sets are expected to reside within the `./src/data` folder.

## Running scripts

### Node CLI

All scripts in `./src` folder can be run directly in the node CLI with the following command: `node <filename>`. Be sure, however, to first run `npm install` to install the necessary node modules.

### Docker

The contained scripts can also be run through the given Docker container, by issuing the following: `docker-compose run container <filename>`. On first run, docker will build the supplied image and install the necessary node modules, before executing the provided filename in node.
