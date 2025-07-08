import traceback
from django.http import Http404, HttpResponse
from django.shortcuts import render, redirect
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import status
from .serializers import (EtudiantRegisterSerializer, DomaineSerializer, FormationByUserCreateSerializer, FormationByUserReadSerializer,
                         Parametre_formationSerializer, FormationSerializer, ProfLoginSerializer, ProfProfileSerializer, ProfRegisterSerializer, ChapterSerializer, PaymentSerializer, 
                         EtudiantReadSerializer, AdminLoginSerializer)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from .models import (Domaine as DomaineModal, Formation_by_user, Payment, ProfRegister, EtudiantRegister, Parametre_formation, Formation as FormationModal, Chapter, Status, Video)
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from drf_nested_forms.parsers import NestedMultiPartParser, NestedJSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.generics import ListAPIView
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "message": "Connexion administrateur réussie",
                "email": serializer.validated_data["email"]
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class LoginProf(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Données reçues dans LoginProf :", request.data)
        serializer = ProfLoginSerializer(data=request.data)
        if serializer.is_valid():
            print("Validation réussie, professeur trouvé :", serializer.validated_data["email"])
            return Response({
                "message": "Connexion professeur réussie",
                "id": serializer.validated_data["id"],
                "email": serializer.validated_data["email"],
                "first_name": serializer.validated_data["first_name"],
                "last_name": serializer.validated_data["last_name"],
                "fonction": serializer.validated_data["fonction"],
                "access_token": serializer.validated_data["access_token"],
                "refresh_token": serializer.validated_data["refresh_token"]
            }, status=status.HTTP_200_OK)
        print("Erreur de validation :", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
class ProfProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            prof = ProfRegister.objects.get(user=request.user)
            serializer = ProfProfileSerializer(prof)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ProfRegister.DoesNotExist:
            return Response({"error": "Utilisateur non enregistré en tant que professeur"}, status=status.HTTP_403_FORBIDDEN)

class ProfStudentAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, prof_id):
        try:
            # Vérifier si le professeur existe
            professor = ProfRegister.objects.get(id=prof_id)
            # Récupérer les formations du professeur
            formations = FormationModal.objects.filter(prof_id=professor)
            # Récupérer les inscriptions confirmées (status=1) pour ces formations
            inscriptions = Formation_by_user.objects.filter(
                formation_id__in=formations,
                status__value=1
            ).select_related('user_id', 'user_id__etudiantregister', 'formation_id')
            # Construire une liste d'étudiants avec leurs formations
            student_dict = {}
            for inscription in inscriptions:
                if hasattr(inscription.user_id, 'etudiantregister'):
                    student_id = inscription.user_id.etudiantregister.id
                    if student_id not in student_dict:
                        student_dict[student_id] = {
                            'id': student_id,
                            'full_name': inscription.user_id.etudiantregister.full_name,
                            'lastname': inscription.user_id.etudiantregister.lastname,
                            'telephone': inscription.user_id.etudiantregister.telephone,
                            'email': inscription.user_id.email,
                            'formations': []
                        }
                    student_dict[student_id]['formations'].append({
                        'id': inscription.formation_id.id,
                        'title': inscription.formation_id.title
                    })
            # Convertir le dictionnaire en liste
            students = list(student_dict.values())
            return Response(students, status=status.HTTP_200_OK)
        except ProfRegister.DoesNotExist:
            return Response({"error": "Professeur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print("Données reçues :", request.data)
        serializer = EtudiantRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Utilisateur créé'},
                            status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        newStudents = EtudiantRegister.objects.all()
        print("Nbr Etudiant: ", newStudents.count())
        if not newStudents.exists():
            print("Aucun etudiant dans la base")
            return Response([], status=status.HTTP_200_OK)
        data_to_serialize = [
            {
                "id": student.user.id,
                "name": student.full_name,
                "lastname": student.lastname,
                "email": student.user.email,
                "telephone": student.telephone,
                "password": student.user.password,
            }
            for student in newStudents
        ]
        print("Données à renvoyer :", data_to_serialize)  # Débogage
        return Response(data_to_serialize, status=status.HTTP_200_OK)
    
class ActivatCount(APIView):
    permission_classes = [AllowAny]
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Lien invalide'}, status=400)
        
        if default_token_generator.check_token(user, token):
            user.is_active=True
            user.save()
            return Response({'message':'Compte active avec succes !'}, status=200)
        else:
            return Response({'error':'Toen non valide ou expire'}, status=400)

class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifiant = request.data.get('identifiant')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=identifiant)
        except User.DoesNotExist:
            try:
                etudiant = EtudiantRegister.objects.get(telephone=identifiant)
                user = etudiant.user
            except EtudiantRegister.DoesNotExist:
                return Response({'erreur': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            try:
                etudiant = EtudiantRegister.objects.get(user=user)
                lastname = etudiant.lastname
            except EtudiantRegister.DoesNotExist:
                lastname = user.username

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Connexxion reussie.',
                'id':user.id,
                'email': user.email,
                'username': user.username,
                'lastname': lastname,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
        else:
            return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
        
class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print("Useeeeer:",user)
        try:
            etudiant = EtudiantRegister.objects.get(user=user)
            lastname = etudiant.lastname
            print("etudiannnttttttttt:",lastname)
        except EtudiantRegister.DoesNotExist:
            lastname = user.username
        
        print("ny id diaaaaa: ",user.username)

        return Response({
            'id':user.id,
            'email': user.email,
            'username': user.username,
            'lastname': lastname,
        })
    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            new_access_token = response.data.get('access')
            print(f"Token refreshed: {new_access_token}")  # Débogage
        return response
    
class Domaine(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        print("Domaine creer :", request.data)
        serializer = DomaineSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response ({'Mesage': 'Domaine inséré'}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        domaines = DomaineModal.objects.all()
        serializer = DomaineSerializer(domaines, many=True)
        return Response(serializer.data, status=200)

class Param_formation(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = Parametre_formationSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'Paramètre de la formation insérée avec succès.'})
        else :
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class Prof(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ProfRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("Prof créé :", request.data)
            return Response({'message': 'Prof inséré'}, status=status.HTTP_201_CREATED)  
        else:
            print("Erreurs de validation :", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        profs = ProfRegister.objects.all()
        print("Nombre de profs trouvés :", profs.count())
        if not profs.exists():
            print("Aucun prof trouvé dans la base de données")
            return Response([], status=status.HTTP_200_OK) 

        data_to_serialize = [
            {
                "id": prof.id,
                "first_name": prof.user.first_name,
                "last_name": prof.user.last_name,
                "fonction": prof.fonction,
                "email": prof.user.email,
                "telephone": prof.telephone,
            }
            for prof in profs
        ]
        return Response(data_to_serialize, status=status.HTTP_200_OK)
    

class FormationAPIView(APIView):
    parser_classes = (NestedMultiPartParser, NestedJSONParser)
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = FormationSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        formations = FormationModal.objects.all()
        serializer = FormationSerializer(formations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        try:
            formation = FormationModal.objects.get(id=pk)
        except FormationModal.DoesNotExist:
            return Response({"error": "Formation non trouvée"}, status=status.HTTP_404_NOT_FOUND)

        publish = request.data.get('publish', False)
        if publish and formation.status.value == 0:
            formation.status = Status.objects.get(value=1)
            formation.save()
            serializer = FormationSerializer(formation)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if formation.status.value == 0:
            serializer = FormationSerializer(formation, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Impossible de modifier une formation publiée"}, status=status.HTTP_403_FORBIDDEN)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FormationsByDomaineView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, domaine_id):
        try:
            domaine = DomaineModal.objects.get(id=domaine_id)
            formations = FormationModal.objects.filter(formation_domaine=domaine)
            serializer = FormationSerializer(formations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DomaineModal.DoesNotExist:
            return Response({"error": "Domaine non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class DomaineDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = DomaineModal.objects.all()
    serializer_class = DomaineSerializer
    lookup_field = 'id'

class FormationDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = FormationModal.objects.all()
    serializer_class = FormationSerializer
    lookup_field='id'
    parser_classes = (NestedMultiPartParser, NestedJSONParser)

    def update(self, request, *args, **kwargs):
        partial = True 
        instance = self.get_object()
        publish = request.data.get('publish', False)
        if publish and instance.status.value == 0:
            instance.status = Status.objects.get(value=1)
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChapterAPIView(APIView):
    permission_classes = [AllowAny]
    def put(self, request, pk, format=None):
        chapter = self.get_object(pk)
        serializer = ChapterSerializer(chapter, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self, pk):
        try:
            return Chapter.objects.get(pk=pk)
        except Chapter.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        chapter = self.get_object(pk)
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data)

class FormationByUserPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_id = request.data.get('user_id')
            lastname = request.data.get('lastname')
            formation_id = request.data.get('formation_id')
            price = request.data.get('price')
            ref_transaction = request.data.get('ref_transaction')

            print("Données reçues:", {
                'user_id': user_id,
                'lastname': lastname,
                'formation_id': formation_id,
                'price': price,
                'ref_transaction': ref_transaction
            })

            if not user_id or not formation_id:
                return Response({"error": "user_id ou formation_id manquant"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(id=user_id)
                try:
                    etudiant = EtudiantRegister.objects.get(user=user)
                    lastname = etudiant.lastname
                except EtudiantRegister.DoesNotExist:
                    lastname = user.username
            except User.DoesNotExist:
                return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

            default_status_id = Status.objects.get(value=0).id 
            formation_by_user_data = {
                'user_id': user_id,
                'formation_id': formation_id,
                'student_name': lastname,
                'status': default_status_id
            }

            formation_by_user_serializer = FormationByUserCreateSerializer(data=formation_by_user_data)
            print("Serializer avant validation:", formation_by_user_serializer)
            if formation_by_user_serializer.is_valid():
                formation_by_user = formation_by_user_serializer.save()
                print("Formation_by_user créé:", formation_by_user.id)
            else:
                print("Erreurs de validation:", formation_by_user_serializer.errors)
                return Response(formation_by_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            payment_data = {
                'formation_by_user_id': formation_by_user.id,
                'paid_amount': price,
                'ref_transaction': ref_transaction,
                'destination_number': '0345929075',
                'status': 'PENDING',
            }
            payment_serializer = PaymentSerializer(data=payment_data)
            if payment_serializer.is_valid():
                payment = payment_serializer.save()
                print("Payment créé:", payment.id)
            else:
                formation_by_user.delete()
                print("Erreurs de payment:", payment_serializer.errors)
                return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            read_serializer = FormationByUserReadSerializer(formation_by_user)
            return Response({
                'formation_by_user': read_serializer.data,
                'payment': PaymentSerializer(payment).data 
            }, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        except Status.DoesNotExist:
            return Response({"error": "Statut par défaut non trouvé"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print("Exception inattendue:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FormationByUserListAPIView(ListAPIView):
    serializer_class = FormationByUserReadSerializer

    def get_queryset(self):
        return Formation_by_user.objects.filter(user_id=self.request.user).select_related('payment')
    
class AdminFormationByUserApproveAPIView(APIView):
    def put(self, request, pk, *args, **kwargs):
        try:
            formation = Formation_by_user.objects.get(id=pk)
            published_status = Status.objects.get(value=1)
            formation.status = published_status
            formation.save()
            serializer = FormationByUserReadSerializer(formation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Formation_by_user.DoesNotExist:
            return Response({"error": "Formation_by_user non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminFormationByUserDeleteAPIView(APIView):
    def delete(self, request, pk, *args, **kwargs):
        try:
            formation = Formation_by_user.objects.get(id=pk)
            formation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Formation_by_user.DoesNotExist:
            return Response({"error": "Formation_by_user non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminFormationByUserListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            formations = Formation_by_user.objects.select_related(
                'formation_id', 'status', 'payment'
            ).all()
            
            serializer = FormationByUserReadSerializer(formations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VideoAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, formation_by_user_id):
        try:
            inscription = Formation_by_user.objects.get(id=formation_by_user_id, user_id=request.user)
            if inscription.status.value != Status.PUBLISHED:
                return Response({"error": "Inscription non approuvée"}, status=status.HTTP_403_FORBIDDEN)
            return Response({"message": "Accès aux vidéos accordé", "videos": []}, status=status.HTTP_200_OK)
        except Formation_by_user.DoesNotExist:
            return Response({"error": "Inscription non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        
class PaymentReceiptView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id, formation_by_user_id__user_id=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Paiement non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        # Configurer la réponse HTTP pour le PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Recu-du-paiement_{payment_id}.pdf"'

        # Créer le document PDF
        doc = SimpleDocTemplate(response, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        elements = []

        # Styles pour le texte
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',  # Utiliser Helvetica
            fontSize=16,
            spaceAfter=12,
            alignment=1,  # Centré
        )
        header_style = ParagraphStyle(
            'HeaderStyle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',  # Utiliser Helvetica
            fontSize=20,
            textColor=colors.HexColor('#003366'),
            spaceAfter=12,
            alignment=1,  # Centré
        )
        footer_style = ParagraphStyle(
            'FooterStyle',
            parent=styles['Normal'],
            fontName='Helvetica',  # Utiliser Helvetica
            fontSize=10,
            textColor=colors.grey,
            spaceBefore=12,
            alignment=1,  # Centré
        )

        # En-tête
        elements.append(Paragraph("INFOMADA", header_style))
        elements.append(Spacer(1, 0.5*cm))

        # Titre
        elements.append(Paragraph("Reçu de Votre Paiement", title_style))
        elements.append(Spacer(1, 0.5*cm))

        # Données pour le tableau
        data = [
            ["Numéro de Paiement", str(payment.id)],
            ["Étudiant", payment.formation_by_user_id.student_name or payment.formation_by_user_id.user_id.username],
            ["Formation", payment.formation_by_user_id.formation_id.title],
            ["Montant", f"{payment.paid_amount} Ar"],
            ["Référence Transaction", payment.ref_transaction],
            ["Date", str(payment.payement_date)],
        ]

        # Créer le tableau
        table = Table(data, colWidths=[6*cm, 10*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#003366')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),  # Utiliser Helvetica
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ]))

        elements.append(table)

        
        elements.append(Spacer(1, 1*cm))
        elements.append(Paragraph('Merci pour votre confiance.', footer_style))
        elements.append(Paragraph('"Ny fahombiazanao no tanjonay"', footer_style))

        # Générer le PDF
        doc.build(elements)
        return response

# class PaymentReceiptView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, payment_id):
#         try:
#             payment = Payment.objects.get(id=payment_id, formation_by_user_id__user_id=request.user)
#         except Payment.DoesNotExist:
#             return Response({"error": "Paiement non trouvé"}, status=status.HTTP_404_NOT_FOUND)

#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = f'attachment; filename="Recu-du-paiement_{payment_id}.pdf"'
        
#         p = canvas.Canvas(response)
#         p.drawString(100, 750, f"Reçu de Paiement")
#         p.drawString(100, 730, f"Numéro de Paiement: {payment.id}")
#         p.drawString(100, 630, f"Étudiant: {payment.formation_by_user_id.student_name or payment.formation_by_user_id.user_id.username}")
#         p.drawString(100, 650, f"Formation: {payment.formation_by_user_id.formation_id.title}")
#         p.drawString(100, 710, f"Montant: {payment.paid_amount} Ar")
#         p.drawString(100, 690, f"Référence Transaction: {payment.ref_transaction}")
#         p.drawString(100, 670, f"Date: {payment.payement_date}")
#         p.showPage()
#         p.save()

#         return response




#------------------------------------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------------------------------------


# import traceback
# from django.http import Http404, HttpResponse
# from django.shortcuts import render, redirect
# from rest_framework import generics
# from django.contrib.auth.models import User
# from rest_framework import status
# from .serializers import (EtudiantRegisterSerializer,DomaineSerializer, FormationByUserCreateSerializer, FormationByUserReadSerializer,
#                           Parametre_formationSerializer, FormationSerializer,ProfRegisterSerializer, ChapterSerializer, PaymentSerializer)
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.contrib.auth.tokens import default_token_generator
# from django.utils.http import urlsafe_base64_decode
# from .models import (Domaine as DomaineModal, Formation_by_user, Payment, ProfRegister, EtudiantRegister, Parametre_formation, Formation as FormationModal, Chapter, Status, Video)
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.core.exceptions import ObjectDoesNotExist, ValidationError
# from drf_nested_forms.parsers import NestedMultiPartParser, NestedJSONParser
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.permissions import AllowAny
# from rest_framework_simplejwt.views import TokenRefreshView
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.generics import ListAPIView
# from reportlab.pdfgen import canvas



# class RegisterView(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         print("Données reçues :", request.data)
#         serializer = EtudiantRegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message':'Utilisateur créé'},
#                             status=status.HTTP_201_CREATED)
#         else:
#             print(serializer.errors)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     def get(self, request):
#         newStudents = EtudiantRegister.objects.all()
#         print("Nbr Etudiant: ", newStudents.count())
#         if not newStudents.exists():
#             print("Aucun etudiant dans la base")
#             return Response([], status=status.HTTP_200_OK)
#         data_to_serialize = [
#             {
#                 "id": student.user.id,
#                 "name": student.full_name,
#                 "lastname": student.lastname,
#                 "email": student.user.email,
#                 "telephone": student.telephone,
#                 "password": student.user.password,
#             }
#             for student in newStudents
#         ]
#         print("Données à renvoyer :", data_to_serialize)  # Débogage
#         return Response(data_to_serialize, status=status.HTTP_200_OK)
    
# class ActivatCount(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request, uidb64, token):
#         try:
#             uid = urlsafe_base64_decode(uidb64).decode()
#             user = User.objects.get(pk=uid)
#         except(TypeError, ValueError, OverflowError, User.DoesNotExist):
#             return Response({'error': 'Lien invalide'}, status=400)
        
#         if default_token_generator.check_token(user, token):
#             user.is_active=True
#             user.save()
#             return Response({'message':'Compte active avec succes !'}, status=200)
#         else:
#             return Response({'error':'Toen non valide ou expire'}, status=400)

# class Login(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         identifiant = request.data.get('identifiant')
#         password = request.data.get('password')

#         try:
#             user = User.objects.get(email=identifiant)
#         except User.DoesNotExist:
#             try:
#                 etudiant = EtudiantRegister.objects.get(telephone=identifiant)
#                 user = etudiant.user
#             except EtudiantRegister.DoesNotExist:
#                 return Response({'erreur': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

#         if user.check_password(password):
#             try:
#                 etudiant = EtudiantRegister.objects.get(user=user)
#                 lastname = etudiant.lastname
#             except EtudiantRegister.DoesNotExist:
#                 lastname = user.username

#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'message': 'Connexxion reussie.',
#                 'id':user.id,
#                 'email': user.email,
#                 'username': user.username,
#                 'lastname': lastname,
#                 'access_token': str(refresh.access_token),
#                 'refresh_token': str(refresh),
#             })
#         else:
#             return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
        
# class UserProfile(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         print("Useeeeer:",user)
#         try:
#             etudiant = EtudiantRegister.objects.get(user=user)
#             lastname = etudiant.lastname
#             print("etudiannnttttttttt:",lastname)
#         except EtudiantRegister.DoesNotExist:
#             lastname = user.username
        
#         print("ny id diaaaaa: ",user.username)

#         return Response({
#             'id':user.id,
#             'email': user.email,
#             'username': user.username,
#             'lastname': lastname,
#         })
    
# class CustomTokenRefreshView(TokenRefreshView):
#     # permission_classes = [IsAuthenticated]  

#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         if response.status_code == 200:
#             new_access_token = response.data.get('access')
#             print(f"Token refreshed: {new_access_token}")  # Débogage
#         return response
    
# class Domaine(APIView):
#     permission_classes = [AllowAny]
#     def post(self,request):
#         print("Domaine creer :", request.data)
#         serializer = DomaineSerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response ({'Mesage': 'Domaine inséré'}, status=status.HTTP_201_CREATED)
#         else:
#             print(serializer.errors)
#             return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
#     def get(self, request):
#         domaines = DomaineModal.objects.all()
#         serializer = DomaineSerializer(domaines, many=True)
#         return Response(serializer.data, status=200)

# class Param_formation(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         serializer = Parametre_formationSerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'Paramètre de la formation insérée avec succès.'})
#         else :
#             return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# class Prof(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         serializer = ProfRegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             print("Prof créé :", request.data)
#             return Response({'message': 'Prof inséré'}, status=status.HTTP_201_CREATED)  
#         else:
#             print("Erreurs de validation :", serializer.errors)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         profs = ProfRegister.objects.all()
#         print("Nombre de profs trouvés :", profs.count())
#         if not profs.exists():
#             print("Aucun prof trouvé dans la base de données")
#             return Response([], status=status.HTTP_200_OK) 

#         data_to_serialize = [
#             {
#                 "id": prof.id,
#                 "first_name": prof.user.first_name,
#                 "last_name": prof.user.last_name,
#                 "fonction": prof.fonction,
#                 "email": prof.user.email,
#                 "telephone": prof.telephone,
#             }
#             for prof in profs
#         ]
#         return Response(data_to_serialize, status=status.HTTP_200_OK)
    

# class FormationAPIView(APIView):
#     parser_classes = (NestedMultiPartParser, NestedJSONParser)
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = FormationSerializer(data=request.data)
        
#         if serializer.is_valid(raise_exception=True): 
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         formations = FormationModal.objects.all()
#         serializer = FormationSerializer(formations, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
#     def put(self, request, pk):
#         try:
#             formation = FormationModal.objects.get(id=pk)
#         except FormationModal.DoesNotExist:
#             return Response({"error": "Formation non trouvée"}, status=status.HTTP_404_NOT_FOUND)

#         publish = request.data.get('publish', False)
#         if publish and formation.status.value == 0:
#             formation.status = Status.objects.get(value=1)
#             formation.save()
#             serializer = FormationSerializer(formation)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         if formation.status.value == 0:
#             serializer = FormationSerializer(formation, data=request.data, partial=True)
#             if serializer.is_valid(raise_exception=True):
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Impossible de modifier une formation publiée"}, status=status.HTTP_403_FORBIDDEN)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class FormationsByDomaineView(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request, domaine_id):
#         try:
#             domaine = DomaineModal.objects.get(id=domaine_id)
#             formations = FormationModal.objects.filter(formation_domaine=domaine)
#             serializer = FormationSerializer(formations, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except DomaineModal.DoesNotExist:
#             return Response({"error": "Domaine non trouvé"}, status=status.HTTP_404_NOT_FOUND)

# class DomaineDetailView(generics.RetrieveAPIView):
#     permission_classes = [AllowAny]
#     queryset = DomaineModal.objects.all()
#     serializer_class = DomaineSerializer
#     lookup_field = 'id'

# class FormationDetailView(generics.RetrieveAPIView):
#     permission_classes = [AllowAny]
#     # permission_classes = [IsAuthenticated]
#     queryset = FormationModal.objects.all()
#     serializer_class = FormationSerializer
#     lookup_field='id'
#     parser_classes = (NestedMultiPartParser, NestedJSONParser)

#     def update(self, request, *args, **kwargs):
#         partial = True 
#         instance = self.get_object()
#         publish = request.data.get('publish', False)
#         if publish and instance.status.value == 0:  # Si demande de publication et non publié
#             instance.status = Status.objects.get(value=1)
#             instance.save()
#             serializer = self.get_serializer(instance)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         if serializer.is_valid():
#             self.perform_update(serializer)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class ChapterAPIView(APIView):
#     permission_classes = [AllowAny]
#     def put(self, request, pk, format=None):
#         chapter = self.get_object(pk)
#         serializer = ChapterSerializer(chapter, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get_object(self, pk):
#         try:
#             return Chapter.objects.get(pk=pk)
#         except Chapter.DoesNotExist:
#             raise Http404

#     def get(self, request, pk, format=None):
#         chapter = self.get_object(pk)
#         serializer = ChapterSerializer(chapter)
#         return Response(serializer.data)

# class FormationByUserPaymentAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             user_id = request.data.get('user_id')
#             lastname = request.data.get('lastname')
#             formation_id = request.data.get('formation_id')
#             price = request.data.get('price')
#             ref_transaction = request.data.get('ref_transaction')

#             print("Données reçues:", {
#                 'user_id': user_id,
#                 'lastname': lastname,
#                 'formation_id': formation_id,
#                 'price': price,
#                 'ref_transaction': ref_transaction
#             })

#             if not user_id or not formation_id:
#                 return Response({"error": "user_id ou formation_id manquant"}, status=status.HTTP_400_BAD_REQUEST)

#             try:
#                 user = User.objects.get(id=user_id)
#                 try:
#                     etudiant = EtudiantRegister.objects.get(user=user)
#                     lastname = etudiant.lastname
#                 except EtudiantRegister.DoesNotExist:
#                     lastname = user.username
#             except User.DoesNotExist:
#                 return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

#             default_status_id = Status.objects.get(value=0).id 
#             formation_by_user_data = {
#                 'user_id': user_id,
#                 'formation_id': formation_id,
#                 'student_name': lastname,
#                 'status': default_status_id
#             }

#             formation_by_user_serializer = FormationByUserCreateSerializer(data=formation_by_user_data)
#             print("Serializer avant validation:", formation_by_user_serializer)
#             if formation_by_user_serializer.is_valid():
#                 formation_by_user = formation_by_user_serializer.save()
#                 print("Formation_by_user créé:", formation_by_user.id)
#             else:
#                 print("Erreurs de validation:", formation_by_user_serializer.errors)
#                 return Response(formation_by_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#             payment_data = {
#                 'formation_by_user_id': formation_by_user.id,
#                 'paid_amount': price,
#                 'ref_transaction': ref_transaction,
#                 'destination_number': '0345929075',
#                 'status': 'PENDING',
#             }
#             payment_serializer = PaymentSerializer(data=payment_data)
#             if payment_serializer.is_valid():
#                 payment = payment_serializer.save()
#                 print("Payment créé:", payment.id)
#             else:
#                 formation_by_user.delete()
#                 print("Erreurs de payment:", payment_serializer.errors)
#                 return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#             read_serializer = FormationByUserReadSerializer(formation_by_user)
#             return Response({
#                 'formation_by_user': read_serializer.data,
#                 'payment': PaymentSerializer(payment).data 
#             }, status=status.HTTP_201_CREATED)

#         except User.DoesNotExist:
#             return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
#         except Status.DoesNotExist:
#             return Response({"error": "Statut par défaut non trouvé"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             print("Exception inattendue:", str(e))
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class FormationByUserListAPIView(ListAPIView):
#     # permission_classes = [IsAuthenticated]
#     serializer_class = FormationByUserReadSerializer

#     def get_queryset(self):
#         return Formation_by_user.objects.filter(user_id=self.request.user).select_related('payment')
    
# class AdminFormationByUserApproveAPIView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def put(self, request, pk, *args, **kwargs):
#         try:
#             formation = Formation_by_user.objects.get(id=pk)
#             published_status = Status.objects.get(value=1)
#             formation.status = published_status
#             formation.save()
#             serializer = FormationByUserReadSerializer(formation)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Formation_by_user.DoesNotExist:
#             return Response({"error": "Formation_by_user non trouvée"}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class AdminFormationByUserDeleteAPIView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def delete(self, request, pk, *args, **kwargs):
#         try:
#             formation = Formation_by_user.objects.get(id=pk)
#             formation.delete()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         except Formation_by_user.DoesNotExist:
#             return Response({"error": "Formation_by_user non trouvée"}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class AdminFormationByUserListAPIView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         try:
#             formations = Formation_by_user.objects.select_related(
#                 'formation_id', 'status', 'payment'
#             ).all()
            
#             serializer = FormationByUserReadSerializer(formations, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class VideoAccessView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, formation_by_user_id):
#         try:
#             inscription = Formation_by_user.objects.get(id=formation_by_user_id, user_id=request.user)
#             if inscription.status.value != Status.PUBLISHED:
#                 return Response({"error": "Inscription non approuvée"}, status=status.HTTP_403_FORBIDDEN)
#             return Response({"message": "Accès aux vidéos accordé", "videos": []}, status=status.HTTP_200_OK)
#         except Formation_by_user.DoesNotExist:
#             return Response({"error": "Inscription non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        
# class PaymentReceiptView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, payment_id):
#         try:
#             payment = Payment.objects.get(id=payment_id, formation_by_user_id__user_id=request.user)
#         except Payment.DoesNotExist:
#             return Response({"error": "Paiement non trouvé"}, status=status.HTTP_404_NOT_FOUND)

#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = f'attachment; filename="Recu-du-paiement_{payment_id}.pdf"'
        
#         p = canvas.Canvas(response)
#         p.drawString(100, 750, f"Reçu de Paiement")
#         p.drawString(100, 730, f"Numéro de Paiement: {payment.id}")
#         p.drawString(100, 630, f"Étudiant: {payment.formation_by_user_id.student_name or payment.formation_by_user_id.user_id.username}")
#         p.drawString(100, 650, f"Formation: {payment.formation_by_user_id.formation_id.title}")
#         p.drawString(100, 710, f"Montant: {payment.paid_amount} Ar")
#         p.drawString(100, 690, f"Référence Transaction: {payment.ref_transaction}")
#         p.drawString(100, 670, f"Date: {payment.payement_date}")
#         p.showPage()
#         p.save()

#         return response

# # class FormationByUserPaymentAPIView(APIView):
# #     permission_classes = [IsAuthenticated]

# #     def post(self, request):
# #         try:
# #             # Récupérer les données du frontend
# #             user_id = request.data.get('user_id')
# #             student_name = request.data.get('student_name')
# #             formation_id = request.data.get('formation_id')
# #             price = request.data.get('price')
# #             ref_transaction = request.data.get('ref_transaction')

# #             # Vérifier si l'utilisateur existe
# #             print("refff: ",ref_transaction)
# #             try:
# #                 user = User.objects.get(id=user_id)
# #             except User.DoesNotExist:
# #                 return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

# #             # Préparer les données pour le serializer
# #             formation_by_user_data = {
# #                 'user_id': user_id,  # Passer l'ID pour le PrimaryKeyRelatedField
# #                 'student_name': student_name,
# #                 'formation_id': formation_id,
# #                 # formation_id sera géré via l'URL ou une autre logique si nécessaire
# #             }

# #             # Valider et sauvegarder Formation_by_user
# #             formation_by_user_serializer = FormationByUserSerializer(data=formation_by_user_data)
# #             print("inona ny atooooo: ",formation_by_user_serializer)
# #             if formation_by_user_serializer.is_valid():
# #                 formation_by_user = formation_by_user_serializer.save()
# #             else:
# #                 return Response(formation_by_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #             # Créer une entrée dans Payment
# #             payment_data = {
# #                 'formation_by_user': formation_by_user.id,
# #                 'price': price,
# #                 'ref_transaction': ref_transaction,
# #             }
# #             payment_serializer = PaymentSerializer(data=payment_data)
# #             if payment_serializer.is_valid():
# #                 payment_serializer.save()
# #             else:
# #                 # Supprimer l'entrée Formation_by_user en cas d'échec du paiement
# #                 formation_by_user.delete()
# #                 return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #             return Response({
# #                 'formation_by_user': formation_by_user_serializer.data,
# #                 'payment': payment_serializer.data
# #             }, status=status.HTTP_201_CREATED)

# #         except User.DoesNotExist:
# #             return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
# #         except Exception as e:
# #             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)