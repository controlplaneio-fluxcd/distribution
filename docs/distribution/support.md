# Technical Support Policy

ControlPlane offers a range of support services to help you get the most out of
Enterprise for Flux CD. The support services included in the [subscription plans](../pricing/index.md) are:

- **Around-the-Clock Support**: dedicated on-call assistance for Flux-related issues and inquiries.
- **Vulnerability Management**: disclosures and remediation guidance for Flux-related vulnerabilities.
- **Product Updates**: regular communication on Flux updates, patches, RFCs, and roadmap changes.

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

## Vulnerability Management

ControlPlane continuously monitors the Flux controllers for vulnerabilities and provides
remediation guidance for CVEs affecting Flux functionality.

The security team is responsible for assessing the exploit ability of the vulnerabilities
and producing patches. CVE exceptions are issued in the OpenVEX format for vulnerabilities
that are not exploitable in the context of the Flux controllers.

### Security Bulletins

The support team issues security bulletins to customers containing the CVEs details,
VEX documents for CVE exceptions, and the container images digests with fixes.
The security bulletins are sent via email to the primary contact person of the customer
and are also available in the support portal.

Customers are responsible for applying the patches provided in the security bulletins
to their Flux controllers in a timely manner. The support team is available to assist
with the patching process and to answer any questions related to the security bulletins.

!!! tip "Security Embargoes"

    The security bulletins are issued under embargo until the vulnerabilities are publicly disclosed.
    During the embargo period, customers are required to keep the information confidential.

## Product Updates

ControlPlane provides customers with regular communication over email on the following topics:

- Feature releases and updates for the enterprise distribution of Flux CD.
- Security bulletins for vulnerabilities affecting Flux functionality.
- Patches and hotfixes for the Flux controllers and the Flux Operator.
- Request for Comments (RFCs) and Roadmap changes for the CNCF Flux project.
- Best practices and recommendations for operating Flux in production environments.

## Additional Support Services

Additional support services such as training, consulting, architectural reviews,
and custom development are available upon request and are subject to additional costs
based on the scope of the service.

[Contact us](https://control-plane.io/contact/?inquiry=fluxcd) for more information.
