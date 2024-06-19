# Technical Support Policy

ControlPlane offers a range of support services to help you get the most out of
Enterprise for Flux CD. The support services included in the [subscription plans](../pricing/index.md) are:

- **Around-the-Clock Support**: dedicated on-call assistance for Flux-related issues and inquiries.
- **Vulnerability Management**: disclosures and remediation guidance for Flux-related vulnerabilities.
- **Continuous Updates**: regular communication on Flux updates, patches, RFCs, and roadmap changes.

## Support Channels

ControlPlane provides customers access to the support portal.
The support portal is the primary channel for submitting support requests and tracking their progress.
In case of an emergency when the support portal is not accessible, customers can contact the support team via email.

## Support Cases

A support case should consist of a single request, and should include all relevant information
to help the support team understand the issue and provide a timely resolution.
When reporting a case, the customer should provide an impact statement to help the support team
determine the [severity level](#support-severity-levels).

The scope of a support case is limited to the Flux functionality provided by the
[Flux controllers](../guides/flux-architecture.md#flux-controllers) part of the
ControlPlane distribution, as well as the [Flux Operator](../operator/index.md).
Support for third-party tools and integrations is not included in the standard support services.

ControlPlane reserves the right to dismiss support cases that are not directly related to the
Flux functionality or that require for ControlPlane personnel to access the customer's infrastructure.
The support team offers assistance with the installation, configuration, and upgrade of the
ControlPlane distribution, but it is the customer's responsibility to operate and maintain the
Flux controllers in their environment.

## Support Severity Levels

The severity level of a support case is determined by the impact of
the issue on the customer's business operations.

| Support Level    | Response Time     | Impact                                                                                                  |
|------------------|-------------------|---------------------------------------------------------------------------------------------------------|
| Level 1 - Urgent | 4 Business hours  | Full outage of Flux in production environments that halts your business critical operations.            |
| Level 2 - High   | 8 Business hours  | Partial outage of Flux in production environments that impacts your business critical operations.       |
| Level 3 - Medium | 12 Business hours | Degraded performance of Flux in production environments that impacts your business critical operations. |
| Level 4 - Low    | 24 Business hours | General inquiries, feature requests, and non-critical issues affecting Flux functionally.               |

**Business Hour** means an hour during Monday through Friday from 9:00 AM to 6:00 PM, excluding public holidays.

## Additional Support Services

Additional support services such as training, consulting, architectural reviews,
and custom development are available upon request and are subject to additional costs
based on the scope of the service.
