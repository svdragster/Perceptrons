package de.svdragster.perceptrons;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class Network {

	public List<Neuron> inputLayer 		= new ArrayList<>();
	public List<Neuron> hiddenLayer 	= new ArrayList<>();
	public List<Neuron> outputLayer	 	= new ArrayList<>();

	private float bias = 0.1f;

	public Network() {
		// input feeds to hidden layer (or output)
		InputNeuron input1 = new InputNeuron("input1", 1);
		InputNeuron input2 = new InputNeuron("input2", 1);
		inputLayer.add(input1);
		inputLayer.add(input2);

		Neuron hidden1 = new Neuron("hidden1");
		Neuron hidden2 = new Neuron("hidden2");
		Neuron hidden3 = new Neuron("hidden3");
		hiddenLayer.add(hidden1);
		hiddenLayer.add(hidden2);
		hiddenLayer.add(hidden3);

		Neuron output = new Neuron("output");
		outputLayer.add(output);

		connect(inputLayer,  hiddenLayer);
		connect(hiddenLayer, outputLayer);

		//connect(inputLayer, outputLayer);
	}

	public void connect(List<Neuron> fromLayer, List<Neuron> toLayer) {
		for (Neuron from : fromLayer) {
			for (Neuron to : toLayer) {
				Connection connection = new Connection(0, (float) (Math.random()*2-1));
				from.getDestinations().add(connection);
				to.getInput().add(connection);

				System.out.println("__________ " + from.getName() + " connected to " + to.getName());
			}
		}
	}

	public void calculate(float[] inputs, float correctOutput) {
		for (int i=0; i<inputs.length; i++) {
			Neuron neuron = inputLayer.get(i);
			neuron.setValue(inputs[i]);
			neuron.calculateValue(this);
		}

		for (int i=0; i<hiddenLayer.size(); i++) {
			Neuron neuron = hiddenLayer.get(i);
			neuron.calculateValue(this);

			float value = neuron.calculateValue(this);
			float delta = correctOutput - value;

			System.out.println("HIDDEN: " + neuron + " -> " + value + ", delta " + delta);

			neuron.adjustWeights(delta, this);
		}

		for (int i=0; i<outputLayer.size(); i++) {
			Neuron neuron = outputLayer.get(i);
			float value = neuron.calculateValue(this);
			float delta = correctOutput - value;



			System.out.println("OUT: " + neuron + " ##################### -> " + value + ", delta " + delta);

			neuron.adjustWeights(delta, this);
		}
	}

	public List<Neuron> getInputLayer() {
		return inputLayer;
	}

	public void setInputLayer(List<Neuron> inputLayer) {
		this.inputLayer = inputLayer;
	}

	public List<Neuron> getHiddenLayer() {
		return hiddenLayer;
	}

	public void setHiddenLayer(List<Neuron> hiddenLayer) {
		this.hiddenLayer = hiddenLayer;
	}

	public List<Neuron> getOutputLayer() {
		return outputLayer;
	}

	public void setOutputLayer(List<Neuron> outputLayer) {
		this.outputLayer = outputLayer;
	}

	public float getBias() {
		return bias;
	}

	public void setBias(float bias) {
		this.bias = bias;
	}
}
