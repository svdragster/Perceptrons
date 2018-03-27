class Neuron {

    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.destinations = [];
        this.value = 0;
        this.learningRate = 0.01;
    }

    activationFunction(t) {
		return t >= 0 ? 1 : -1; // signum function
	}

	calculateValue(network) {
		var sum = network.bias;
        this.inputs.forEach(function(connectionIn) {
            sum += connectionIn.value * connectionIn.weight;
        });

		var value = this.activationFunction(sum);
        this.destinations.forEach(function (connectionOut) {
            connectionOut.value = value;
        });

        this.value = value;

		return value;
	}

	adjustWeights(delta, network) {
        var neuron = this;
        this.inputs.forEach(function(connectionIn) {
            connectionIn.weight = connectionIn.weight + connectionIn.value * delta * neuron.learningRate;
        });
		network.bias += this.learningRate * delta;
	}
};

class Connection {
    constructor(weight) {
        this.weight = weight;
    }
}

class Network {

    constructor(gate) {
        this.gate = gate;
        this.bias = 0.1;

        this.inputLayer = new Array();
        this.hiddenLayer = new Array();
        this.outputLayer = new Array();

        var input1 = new Neuron("input1");
        var input2 = new Neuron("input2");

        var hidden1 = new Neuron("hidden1");
        var hidden2 = new Neuron("hidden2");
        var hidden3 = new Neuron("hidden3");

        var output1 = new Neuron("output1");

        this.inputLayer.push(input1);
        this.inputLayer.push(input2);

        this.hiddenLayer.push(hidden1);
        this.hiddenLayer.push(hidden2);
        this.hiddenLayer.push(hidden3);

        this.outputLayer.push(output1);

        this.connect(this.inputLayer, this.hiddenLayer);
        this.connect(this.hiddenLayer, this.outputLayer);
    }

    connect(fromLayer, toLayer) {
        fromLayer.forEach(function(from, index) {
            toLayer.forEach(function(to, index) {
                var con = new Connection((Math.random()*2) - 1); // Random weight between 1 and -1
                console.log("connected " + from.name + " with " + to.name);
                from.destinations.push(con);
                to.inputs.push(con);
            });
        });
    }

    calculate(inputs, correctOutput) {
        var network = this;
        inputs.forEach(function(input, index) {
            var neuron = network.inputLayer[index];
            neuron.value = input;

            neuron.destinations.forEach(function(connectionOut) {
                connectionOut.value = input;
            });
        });

        this.hiddenLayer.forEach(function(neuron, index) {
            var value = neuron.calculateValue(network);
            var delta = correctOutput - value;

            neuron.adjustWeights(delta, network);
        });

		var foundCorrect = true;
        this.outputLayer.forEach(function(neuron, index) {
            var value = neuron.calculateValue(network);
            var delta = correctOutput - value;

            if (delta != 0) foundCorrect = false;

            console.log("OUT: " + neuron.name + " " + index + " -> " + value + ", delta " + delta);

            neuron.adjustWeights(delta, network);
        });

		return foundCorrect;
	}
};
