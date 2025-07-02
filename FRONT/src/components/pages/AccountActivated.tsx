import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../common/Button'
import { CheckCircle, AlertTriangle } from 'lucide-react'

const AccountActivated: React.FC = () => {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')

  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Compte activé avec succès !</h1>
            <p className="text-gray-600 mt-2">Vous pouvez maintenant vous connecter.</p>
          </>
        ) : (
          <>
            <AlertTriangle className="text-red-500 w-16 h-16 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Échec de l'activation</h1>
            <p className="text-gray-600 mt-2">Le lien est invalide ou a expiré.</p>
          </>
        )}

        <Button
          onClick={() => window.location.href = '/login'}
        >
          Confirmer
        </Button>
      </div>
    </div>
  )
}

export default AccountActivated
