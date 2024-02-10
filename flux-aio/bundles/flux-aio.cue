// Flux AIO bundle
// Documentation: https://timoni.sh/flux-aio/
bundle: {
	apiVersion: "v1alpha1"
	name:       "flux-aio"

	// Enterprise distribution settings
	_distribution: {
		// Container registry image pull token
		token: string @timoni(runtime:string:TOKEN)
		// Container registry address
		registry: "ghcr.io/controlplaneio-fluxcd/distroless" @timoni(runtime:string:REGISTRY)
		// Flux AIO version e.g. 2.2.3-0
		// To list available versions run:
		// timoni mod ls oci://ghcr.io/stefanprodan/modules/flux-aio
		version: "latest" @timoni(runtime:string:VERSION)
	}

	instances: {
		"flux": {
			module: {
				url:     "oci://ghcr.io/stefanprodan/modules/flux-aio"
				version: _distribution.version
			}
			namespace: "flux-system"
			values: {
				controllers: {
					source: image: {
						repository: "\(_distribution.registry)/source-controller"
					}
					kustomize: image: {
						repository: "\(_distribution.registry)/kustomize-controller"
					}
					notification: image: {
						repository: "\(_distribution.registry)/notification-controller"
					}
					helm: image: {
						repository: "\(_distribution.registry)/helm-controller"
					}
				}
				imagePullSecret: {
					registry: _distribution.registry
					password: _distribution.token
					username: "flux"
				}
				hostNetwork:     false
				securityProfile: "privileged"
			}
		}
	}
}
