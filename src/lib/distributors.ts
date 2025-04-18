import { DistributorResponse } from "@torque-labs/sdk";
import { Decimal } from "decimal.js";

enum FunctionType {
  CONSTANT = "CONSTANT",
  LINEAR = "LINEAR",
  STEP = "STEP",
  EXPONENTIAL = "EXPONENTIAL",
}

enum Trend {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

type Tier = {
  input: number;
  output: number;
};

export const getFunctionOutput = (
  distroFn: DistributorResponse["distributionFunction"],
  x: number,
  isAsymmetricOrPoints: boolean,
  decimals?: number
): number => {
  if (!distroFn) {
    throw new Error("Distribution function is required");
  }

  let output: Decimal;

  switch (distroFn.type) {
    case FunctionType.CONSTANT:
      if (!distroFn.yIntercept) {
        throw new Error("yIntercept is required for constant function");
      }
      output = new Decimal(distroFn.yIntercept as number);

      break;
    case FunctionType.LINEAR:
      if (!distroFn.yIntercept || !distroFn.slope) {
        throw new Error(
          "yIntercept and slope are required for linear function"
        );
      }
      const yIntercept = new Decimal(distroFn.yIntercept as number);
      const slope = distroFn.slope
        ? new Decimal(distroFn.slope as number)
        : new Decimal(0);
      const trend = distroFn.trend === Trend.NEGATIVE ? -1 : 1;
      const xDecimal = new Decimal(x);
      output = yIntercept.add(slope.mul(xDecimal).mul(trend));

      break;
    case FunctionType.STEP:
      if (distroFn.tiers.length === 0) {
        throw new Error("Tiers are required for step function");
      }

      output = new Decimal(0);

      for (const tier of distroFn.tiers) {
        const tierParsed = tier as Tier;
        if (x >= tierParsed.input) {
          output = new Decimal(tierParsed.output);
        } else {
          break;
        }
      }

      break;
    case FunctionType.EXPONENTIAL:
      if (
        !distroFn.yIntercept ||
        !distroFn.curveDepth ||
        !distroFn.curveWidth
      ) {
        throw new Error(
          "yIntercept and curve depth/width are required for exponential function"
        );
      }
      const yInterceptDecimal = new Decimal(distroFn.yIntercept as number);
      const curveDepthDecimal = new Decimal(distroFn.curveDepth as number);
      const curveWidthDecimal = new Decimal(distroFn.curveWidth as number);
      const factor = new Decimal(1)
        .add(new Decimal(x).div(curveWidthDecimal))
        .pow(curveDepthDecimal.mul(-1));
      output = yInterceptDecimal.mul(factor);

      break;
    default:
      throw new Error("Invalid function type");
  }

  const out = isAsymmetricOrPoints
    ? Math.floor(output.toNumber())
    : decimals
    ? output.toDecimalPlaces(decimals).toNumber()
    : output.toNumber();

  return out;
};
