;; EHR Integration Contract

(define-constant CONTRACT_OWNER tx-sender)

(define-map ehr-systems
  { ehr-id: (string-ascii 20) }
  {
    name: (string-utf8 100),
    api-endpoint: (string-utf8 256),
    authorized-principal: principal
  }
)

(define-map patient-ehr-mappings
  { patient-id: principal }
  { ehr-id: (string-ascii 20) }
)

(define-public (register-ehr-system (ehr-id (string-ascii 20)) (name (string-utf8 100)) (api-endpoint (string-utf8 256)) (authorized-principal principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u403))
    (ok (map-set ehr-systems
      { ehr-id: ehr-id }
      {
        name: name,
        api-endpoint: api-endpoint,
        authorized-principal: authorized-principal
      }
    ))
  )
)

(define-public (set-patient-ehr-mapping (ehr-id (string-ascii 20)))
  (ok (map-set patient-ehr-mappings
    { patient-id: tx-sender }
    { ehr-id: ehr-id }
  ))
)

(define-read-only (get-patient-ehr-mapping (patient-id principal))
  (ok (unwrap! (map-get? patient-ehr-mappings { patient-id: patient-id }) (err u404)))
)

(define-read-only (get-ehr-system (ehr-id (string-ascii 20)))
  (ok (unwrap! (map-get? ehr-systems { ehr-id: ehr-id }) (err u404)))
)

(define-public (log-ehr-update (patient-id principal) (update-info (string-utf8 256)))
  (let
    (
      (patient-mapping (unwrap! (map-get? patient-ehr-mappings { patient-id: patient-id }) (err u404)))
      (ehr-system (unwrap! (map-get? ehr-systems { ehr-id: (get ehr-id patient-mapping) }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get authorized-principal ehr-system)) (err u403))
    (print update-info)
    (ok true)
  )
)

