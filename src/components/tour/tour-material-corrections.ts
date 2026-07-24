const DOUBLE_SIDED_ARCHITECTURAL_MATERIAL =
  /asphalt|concrete|concreto|cimento|piso|ground|gravel|soil|stone|roof|roofing|telha|grama|grass|pavement/i;

export function shouldRenderTourMaterialDoubleSided(
  materialName: string,
) {
  return DOUBLE_SIDED_ARCHITECTURAL_MATERIAL.test(materialName);
}
