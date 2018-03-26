package de.svdragster.perceptrons;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class Connection {

	private float value;
	private float weight;

	public Connection(float value, float weight) {
		this.value = value;
		this.weight = weight;
	}

	public float getValue() {
		return value;
	}

	public void setValue(float value) {
		this.value = value;
	}

	public float getWeight() {
		return weight;
	}

	public void setWeight(float weight) {
		this.weight = weight;
	}
}
