;; Patient Health Record Contract

(define-map patient-records
  { patient-id: principal }
  {
    encrypted-data: (string-utf8 1024),
    last-updated: uint
  }
)

(define-map access-control
  { patient-id: principal, provider-id: principal }
  { can-access: bool }
)

(define-public (add-health-record (encrypted-data (string-utf8 1024)))
  (let
    (
      (patient tx-sender)
    )
    (ok (map-set patient-records
      { patient-id: patient }
      {
        encrypted-data: encrypted-data,
        last-updated: block-height
      }
    ))
  )
)

(define-public (update-health-record (encrypted-data (string-utf8 1024)))
  (let
    (
      (patient tx-sender)
      (existing-record (unwrap! (map-get? patient-records { patient-id: patient }) (err u404)))
    )
    (ok (map-set patient-records
      { patient-id: patient }
      {
        encrypted-data: encrypted-data,
        last-updated: block-height
      }
    ))
  )
)

(define-public (grant-access (provider-id principal))
  (let
    (
      (patient tx-sender)
    )
    (ok (map-set access-control
      { patient-id: patient, provider-id: provider-id }
      { can-access: true }
    ))
  )
)

(define-public (revoke-access (provider-id principal))
  (let
    (
      (patient tx-sender)
    )
    (ok (map-set access-control
      { patient-id: patient, provider-id: provider-id }
      { can-access: false }
    ))
  )
)

(define-read-only (get-health-record (patient-id principal))
  (let
    (
      (record (unwrap! (map-get? patient-records { patient-id: patient-id }) (err u404)))
      (can-access (default-to false (get can-access (map-get? access-control { patient-id: patient-id, provider-id: tx-sender }))))
    )
    (asserts! (or (is-eq tx-sender patient-id) can-access) (err u403))
    (ok record)
  )
)

