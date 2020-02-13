const describeIf = (condition, description, fn) => {
  const describeOrSkip = condition
    ? describe
    : describe.skip

  if (describeOrSkip) describeOrSkip(description, fn)
}

module.exports = {
  describeIf,
  endpointAuth: false,
}
