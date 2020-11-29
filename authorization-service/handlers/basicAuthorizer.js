

export const basicAuthorizer = (event, context, callback) => {

    console.log('Lambda function has been invoked with event:', JSON.stringify(event));

    if (event["type"] !== "TOKEN") {
        callback("Unauthorized");
        return;
    }

    try {
        const { authorizationToken, methodArn } = event;
        const encodedCreds = authorizationToken.split(" ")[1];
        const buff =  Buffer.from(encodedCreds, "base64");
        const plainCreds = buff.toString("utf-8").split(":");
        const userName = plainCreds[0];
        const password = plainCreds[1];

        console.log(`username: ${userName} and password: ${password}`);

        const storedUserPassword = process.env.PASSWORD;
        const effect = !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";
        const policy = generatePolicy(encodedCreds, methodArn, effect);

        callback(null, policy);
    } catch (e) {
        callback(`Unauthorized: ${e.message}`);
    }
}

const generatePolicy = (
    principalId,
    resource,
    effect = "Allow"
) => ({
    principalId,
    policyDocument: {
        Version: "2012-10-17",
        Statement: {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource,
        },
    },
});