import { neuronSamples } from '@/content/neurons';

export type NeuronRecord = { layer: number; neuron: number; delta: number; abs_delta: number; rank: number };

/** The model has 32 layers of 14,336 MLP neurons each. */
export const MODEL_LAYERS = 32;
export const MODEL_NEURONS_PER_LAYER = 14336;

export const neuronRecords: NeuronRecord[] = neuronSamples.map(([layer, neuron, delta], i) => ({
  layer,
  neuron,
  delta,
  abs_delta: Math.abs(delta),
  rank: i + 1,
}));

const layers = neuronRecords.map((r) => r.layer);
export const neuronStats = {
  total: neuronRecords.length,
  distinctLayers: new Set(layers).size,
  firstLayer: Math.min(...layers),
  lastLayer: Math.max(...layers),
  /** Share of all the model's MLP neurons that the sample covers, in percent. */
  percentOfMlp: (neuronRecords.length / (MODEL_LAYERS * MODEL_NEURONS_PER_LAYER)) * 100,
};
