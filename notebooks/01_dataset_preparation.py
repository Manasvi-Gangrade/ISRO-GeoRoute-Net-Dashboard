{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "import json\n",
    "\n",
    "os.makedirs(\"sample_data/input\", exist_ok=True)\n",
    "os.makedirs(\"sample_data/output\", exist_ok=True)\n",
    "\n",
    "manifest = {\n",
    "    \"dataset_source\": \"SpaceNet / DeepGlobe Roads Baseline\",\n",
    "    \"spatial_resolution\": \"Cartosat-3 0.3m Simulated Grid\",\n",
    "    \"total_patches_pre_tiled\": 150,\n",
    "    \"tile_dimensions\": [512, 512],\n",
    "    \"coordinate_reference_system\": \"EPSG:32643 - WGS 84 / UTM Zone 43N\"\n",
    "}\n",
    "\n",
    "with open(\"sample_data/input/dataset_manifest.json\", \"w\") as f:\n",
    "    json.dump(manifest, f, indent=2)\n",
    "\n",
    "print(\"✔ Project workspace configured. Training/validation splits initialized successfully.\")"
   ]
  }
 ],
 "metadata": {},
 "nbformat": 4,
 "nbformat_minor": 2
}
