from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ( AdminFormationByUserApproveAPIView, AdminFormationByUserDeleteAPIView, AdminFormationByUserListAPIView, 
                    FormationByUserListAPIView, FormationByUserPaymentAPIView, PaymentReceiptView, RegisterView,
                    ActivatCount,Login, Domaine, Prof, FormationAPIView, ChapterAPIView, DomaineDetailView, 
                    FormationsByDomaineView, FormationDetailView,UserProfile,CustomTokenRefreshView, VideoAccessView)


urlpatterns = [
    # path('',views.main,name='main'),
    path('register/',RegisterView.as_view(), name='register'),
    path('api/activate/<uidb64>/<token>/',ActivatCount.as_view(), name='activate'),
    path('login/',Login.as_view(), name='login'),
    path('me/',UserProfile.as_view(), name='UserProfile'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('domaine/',Domaine.as_view(), name='domaine'),
    path('prof/',Prof.as_view(), name='prof'),
    path('formation/',FormationAPIView.as_view(), name='formation' ),
    path('chapter/<int:pk>/',ChapterAPIView.as_view(),name='chapter' ),
    path('domaine/<int:id>/', DomaineDetailView.as_view(), name='domaine_detail'),
    path('formationByDomaine/<int:domaine_id>/', FormationsByDomaineView.as_view(), name='formations_by_domaine'),
    path('formation/<int:id>/', FormationDetailView.as_view(), name='formation_detail'),
    path('formationByUser/', FormationByUserPaymentAPIView.as_view(), name='formation-by-user'),
    path('formationByUserList/', FormationByUserListAPIView.as_view(), name='formation_by_user_list'),
    path('formation_by_user_get/', AdminFormationByUserListAPIView.as_view(), name='admin_formation_by_user_list'),
    path('video-access/<int:formation_by_user_id>/', VideoAccessView.as_view(), name='video-access'),
    path('payment/receipt/<int:payment_id>/', PaymentReceiptView.as_view(), name='payment-receipt'),
    path('formation_by_user_get/<int:pk>/approve/', AdminFormationByUserApproveAPIView.as_view(), name='admin_formation_by_user_approve'),
    path('formation_by_user_get/<int:pk>/', AdminFormationByUserDeleteAPIView.as_view(), name='admin_formation_by_user_delete'),
    # path('payment/', PaymentAPIView.as_view(), name='payment'),
]