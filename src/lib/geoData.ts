export type NodeId = string;

export type GeoNode = {
  id: NodeId;
  x: number;
  y: number;
  lat: number;
  lng: number;
  label?: string;
  gatekeeper?: boolean;
};

export type GeoEdge = {
  id: string;
  a: NodeId;
  b: NodeId;
  R: number; // Reliability score
  C: number; // pixel confidence
  A: number; // angular alignment cos θ
  D: number; // gap distance (m)
  healed?: boolean; // was reconstructed under occlusion
};

export const NODES: GeoNode[] = [
  { id: "N1", x: 80, y: 90, lat: 17.4152, lng: 78.4867 },
  { id: "N2", x: 230, y: 70, lat: 17.4158, lng: 78.4881 },
  { id: "N3", x: 380, y: 110, lat: 17.4149, lng: 78.4895, label: "GK-03", gatekeeper: true },
  { id: "N4", x: 540, y: 80, lat: 17.416, lng: 78.4902 },
  { id: "N5", x: 680, y: 140, lat: 17.414, lng: 78.4915 },
  { id: "N6", x: 120, y: 230, lat: 17.4131, lng: 78.4872 },
  { id: "N7", x: 260, y: 210, lat: 17.4135, lng: 78.4883 },
  { id: "N8", x: 410, y: 250, lat: 17.412, lng: 78.4898, label: "GK-08", gatekeeper: true },
  { id: "N9", x: 560, y: 220, lat: 17.4128, lng: 78.4905 },
  { id: "N10", x: 700, y: 280, lat: 17.4111, lng: 78.492 },
  { id: "N11", x: 180, y: 360, lat: 17.4105, lng: 78.4875 },
  { id: "N12", x: 340, y: 380, lat: 17.41, lng: 78.489, label: "GK-12", gatekeeper: true },
  { id: "N13", x: 500, y: 350, lat: 17.411, lng: 78.49 },
  { id: "N14", x: 640, y: 410, lat: 17.4095, lng: 78.4912 },
  { id: "N15", x: 260, y: 480, lat: 17.4082, lng: 78.488 },
  { id: "N16", x: 430, y: 490, lat: 17.408, lng: 78.4895 },
  { id: "N17", x: 590, y: 470, lat: 17.4085, lng: 78.4908 },
  // Adding more nodes for realism
  { id: "N18", x: 100, y: 400, lat: 17.4095, lng: 78.4865 },
  { id: "N19", x: 730, y: 190, lat: 17.413, lng: 78.493 },
  { id: "N20", x: 360, y: 30, lat: 17.417, lng: 78.489 },
];

export const EDGES: GeoEdge[] = [
  { id: "E1", a: "N1", b: "N2", R: 0.94, C: 0.97, A: 0.99, D: 6 },
  { id: "E2", a: "N2", b: "N3", R: 0.88, C: 0.93, A: 0.98, D: 9 },
  { id: "E3", a: "N3", b: "N4", R: 0.61, C: 0.78, A: 0.86, D: 22, healed: true },
  { id: "E4", a: "N4", b: "N5", R: 0.91, C: 0.95, A: 0.98, D: 8 },
  { id: "E5", a: "N1", b: "N6", R: 0.89, C: 0.92, A: 0.99, D: 7 },
  { id: "E6", a: "N2", b: "N7", R: 0.83, C: 0.90, A: 0.94, D: 12 },
  { id: "E7", a: "N3", b: "N8", R: 0.79, C: 0.88, A: 0.92, D: 14 },
  { id: "E8", a: "N4", b: "N9", R: 0.87, C: 0.94, A: 0.96, D: 9 },
  { id: "E9", a: "N5", b: "N10", R: 0.66, C: 0.81, A: 0.87, D: 19, healed: true },
  { id: "E10", a: "N6", b: "N7", R: 0.92, C: 0.96, A: 0.98, D: 6 },
  { id: "E11", a: "N7", b: "N8", R: 0.85, C: 0.91, A: 0.95, D: 11 },
  { id: "E12", a: "N8", b: "N9", R: 0.90, C: 0.95, A: 0.97, D: 7 },
  { id: "E13", a: "N9", b: "N10", R: 0.81, C: 0.89, A: 0.94, D: 13 },
  { id: "E14", a: "N6", b: "N11", R: 0.86, C: 0.92, A: 0.96, D: 10 },
  { id: "E15", a: "N7", b: "N12", R: 0.58, C: 0.74, A: 0.85, D: 24, healed: true },
  { id: "E16", a: "N8", b: "N12", R: 0.93, C: 0.96, A: 0.99, D: 6 },
  { id: "E17", a: "N9", b: "N13", R: 0.88, C: 0.94, A: 0.96, D: 8 },
  { id: "E18", a: "N10", b: "N14", R: 0.82, C: 0.90, A: 0.93, D: 13 },
  { id: "E19", a: "N11", b: "N12", R: 0.87, C: 0.93, A: 0.96, D: 9 },
  { id: "E20", a: "N12", b: "N13", R: 0.84, C: 0.91, A: 0.95, D: 11 },
  { id: "E21", a: "N13", b: "N14", R: 0.80, C: 0.89, A: 0.93, D: 14 },
  { id: "E22", a: "N11", b: "N15", R: 0.78, C: 0.87, A: 0.92, D: 15 },
  { id: "E23", a: "N12", b: "N16", R: 0.63, C: 0.79, A: 0.86, D: 21, healed: true },
  { id: "E24", a: "N13", b: "N16", R: 0.86, C: 0.93, A: 0.95, D: 10 },
  { id: "E25", a: "N14", b: "N17", R: 0.89, C: 0.94, A: 0.97, D: 8 },
  { id: "E26", a: "N15", b: "N16", R: 0.83, C: 0.91, A: 0.94, D: 12 },
  { id: "E27", a: "N16", b: "N17", R: 0.85, C: 0.92, A: 0.95, D: 11 },
  // Adding realistic peripheral edges
  { id: "E28", a: "N11", b: "N18", R: 0.95, C: 0.97, A: 0.98, D: 4 },
  { id: "E29", a: "N5", b: "N19", R: 0.71, C: 0.85, A: 0.89, D: 16, healed: true },
  { id: "E30", a: "N2", b: "N20", R: 0.92, C: 0.95, A: 0.96, D: 7 },
  { id: "E31", a: "N3", b: "N20", R: 0.88, C: 0.92, A: 0.94, D: 9 },
];

export function generateGeoJSON() {
  const features: any[] = [];

  // Add nodes as Point features
  NODES.forEach((n) => {
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [n.lng, n.lat],
      },
      properties: {
        id: n.id,
        label: n.label || "",
        gatekeeper: !!n.gatekeeper,
      },
    });
  });

  // Add edges as LineString features
  EDGES.forEach((e) => {
    const nodeA = NODES.find((n) => n.id === e.a);
    const nodeB = NODES.find((n) => n.id === e.b);
    if (nodeA && nodeB) {
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [nodeA.lng, nodeA.lat],
            [nodeB.lng, nodeB.lat],
          ],
        },
        properties: {
          id: e.id,
          reliability: e.R,
          confidence: e.C,
          alignment: e.A,
          gap_distance: e.D,
          healed: !!e.healed,
        },
      });
    }
  });

  return JSON.stringify(
    {
      type: "FeatureCollection",
      features,
    },
    null,
    2
  );
}

export function triggerDownload(content: string, filename: string, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
