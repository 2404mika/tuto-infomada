from rest_framework import serializers
from .models import (
    EtudiantRegister, ProfRegister,Parametre_formation, Domaine, Formation, Chapter,
    Formation_by_user, Payment, Discussion, Role, RolesUserMapping, Token_souscription,
    Exam, Question, Exam_response_selection, Exam_by_user, Exam_response_by_user, Status,Video,Admin
)
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        if not Admin.objects.filter(email=email, password=password).exists():
            raise serializers.ValidationError("Email ou mot de passe incorrect")
        return data
    
class ProfLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "Email ou mot de passe incorrect"})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Email ou mot de passe incorrect"})

        # Vérifier que l'utilisateur est un professeur
        try:
            prof = ProfRegister.objects.get(user=user)
        except ProfRegister.DoesNotExist:
            raise serializers.ValidationError({"detail": "Utilisateur non enregistré en tant que professeur"})

        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)

        return {
            "id": prof.id,  # Retourner l'ID de ProfRegister
            "email": user.email,
            "first_name": prof.first_name,
            "last_name": prof.last_name,
            "fonction": prof.fonction,
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }

class ProfProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    username = serializers.CharField(source='user.username')
    class Meta:
        model = ProfRegister
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'telephone', 'fonction']

class EtudiantRegisterSerializer(serializers.ModelSerializer):
    lastname = serializers.CharField(write_only=True)
    full_name = serializers.CharField(write_only=True)
    telephone = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['lastname','email','password', 'full_name','telephone']
    def create(self, validated_data):
        lastname = validated_data.pop('lastname')
        full_name = validated_data.pop('full_name')
        telephone = validated_data.pop('telephone')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        base_username = email.split('@')[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter+=1

        user = User.objects.create(
            username=username,
            email=email,
            password=password,
            is_active=True

        )

        user.set_password(password)
        user.save()
        EtudiantRegister.objects.create(
            user = user,
            lastname = lastname,
            full_name = full_name,
            telephone = telephone
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_link = f"http://localhost:8000/api/activate/{uid}/{token}/"
        print("Lien d'activation :", activation_link)
        return user
    
class ProfRegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True) 
    last_name = serializers.CharField(write_only=True)
    telephone = serializers.CharField(write_only=True)
    fonction = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'telephone', 'fonction']

    def create(self, validated_data):
        telephone = validated_data.pop('telephone')
        fonction = validated_data.pop('fonction')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        base_username = email.split('@')[0] + "Prof"
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=True
        )
        prof_instance = ProfRegister.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            fonction=fonction,
            telephone=telephone
        )
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "fonction": prof_instance.fonction,
            "email": user.email,
            "telephone": prof_instance.telephone
        }
           
class ProfReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfRegister
        fields = ['id', 'first_name', 'last_name', 'telephone', 'fonction']

class EtudiantReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtudiantRegister
        fields = ['id', 'full_name','lastname', 'telephone']
    
class DomaineReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domaine
        fields = ['id', 'name']


class DomaineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domaine
        fields = ['id','name','image','formations']

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'value', 'name']
        read_only_fields = ['id', 'value', 'name']

class Parametre_formationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parametre_formation
        fields = ['id','price','duration']

class VideoSerializer(serializers.ModelSerializer):
    file = serializers.FileField(max_length=200, use_url=False)
    name = serializers.CharField(max_length=200, required=False)
    class Meta:
        model = Video
        fields = ['id', 'file', 'name']

class FormationSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = ['id','title','description']
    

# class ChapterSerializer(serializers.ModelSerializer):
#     videos = VideoSerializer(many=True, required=False)
#     # formation_id = serializers.IntegerField(write_only=True, required=True)
#     # formation_id = FormationSerializer(write_only=True, required=True)

#     class Meta:
#         model = Chapter
#         fields = ['id', 'chapter_name', 'description', 'chapter_number', 'videos', 'formation_id']

#     def validate(self, data):
#         print("ChapterSerializer validate data:", data)
#         # Validation manuelle de formation_id
#         formation_id = data.get('formation_id')
#         if not Formation.objects.filter(id=formation_id).exists():
#             raise serializers.ValidationError({"formation_id": "Formation does not exist."})
#         return data

#     def create(self, validated_data):
#         print("ChapterSerializer create validated_data:", validated_data)
#         videos_data = validated_data.pop('videos', [])
#         chapter = Chapter.objects.create(**validated_data)
#         for video_data in videos_data:
#             video = Video.objects.create(**video_data)
#             chapter.video.add(video)
#         return chapter

class ChapterSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, required=False,read_only=True)
    formation = FormationSimpleSerializer(read_only=True, source='formation_id')

    class Meta:
        model = Chapter
        fields = [
            'id', 'chapter_name', 'description', 
            'chapter_number', 'videos', 'formation'
        ]
        extra_kwargs = {
            'formation_id': {'write_only': True, 'required': False}
        }
    
class FormationSerializer(serializers.ModelSerializer):
    # Champs fanaovana (GET)
    parametre_formation_id = Parametre_formationSerializer()
    chapters = ChapterSerializer(many=True, required=False, read_only=True)
    formation_domaine = DomaineReadSerializer(read_only=True)
    prof_id = ProfReadSerializer(read_only=True)
    status = StatusSerializer(read_only=True)

    inscrits = serializers.SerializerMethodField()
    
    # Champs fanaovana (POST)
    formation_domaine_write = serializers.PrimaryKeyRelatedField(
        queryset=Domaine.objects.all(), source='formation_domaine', write_only=True
    )
    prof_id_write = serializers.PrimaryKeyRelatedField(
        queryset=ProfRegister.objects.all(), source='prof_id', write_only=True
    )
    chapters_write = ChapterSerializer(many=True, required=False, write_only=True, source='chapters')


    class Meta:
        model = Formation
        fields = [
            'id', 'title', 'description', 
            'parametre_formation_id', 
            'formation_domaine',
            'formation_domaine_write',
            'prof_id',
            'prof_id_write',
            'status', 
            'chapters',
            'chapters_write',
            'inscrits',
        ]
    def get_inscrits(self, obj):
        # Compter les inscriptions approuvées (status.value == 1)
        return Formation_by_user.objects.filter(formation_id=obj.id, status__value=1).count()   
    
    def create(self, validated_data):
        parametre_data = validated_data.pop('parametre_formation_id')
        chapters_data = validated_data.pop('chapters') 
        
        parametre = Parametre_formation.objects.create(**parametre_data)
        
        formation = Formation.objects.create(
            parametre_formation_id=parametre,
            status=Status.objects.get(value=0),
            **validated_data
        )

        for chapter_data in chapters_data:
            videos_data = chapter_data.pop('videos', [])
            chapter = Chapter.objects.create(formation_id=formation, **chapter_data)
            
            for video_data in videos_data:
                video = Video.objects.create(**video_data)
                chapter.videos.add(video)
                
        return formation    
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.formation_domaine = validated_data.get('formation_domaine', instance.formation_domaine)
        instance.prof_id = validated_data.get('prof_id', instance.prof_id)

        parametre_data = validated_data.get('parametre_formation_id', {})
        instance.parametre_formation_id.price = parametre_data.get('price', instance.parametre_formation_id.price)
        instance.parametre_formation_id.duration = parametre_data.get('duration', instance.parametre_formation_id.duration)
        instance.parametre_formation_id.save()

        chapters_data = validated_data.get('chapters', [])
        instance.chapters.all().delete()
        for chapter_data in chapters_data:
            videos_data = chapter_data.pop('videos', [])
            chapter = Chapter.objects.create(formation_id=instance, **chapter_data)
            for video_data in videos_data:
                video = Video.objects.create(**video_data)
                chapter.videos.add(video)

        instance.save()
        return instance

# class FormationSerializer(serializers.ModelSerializer):
#     parametre_formation_id = Parametre_formationSerializer()
#     chapters = ChapterSerializer(many=True, required=False)
#     formation_domaine_id = serializers.PrimaryKeyRelatedField(
#         queryset=Domaine.objects.all(), source='formation_domaine', write_only=True
#     )
#     formation_domaine = DomaineReadSerializer(read_only=True)
#     prof_id_id = serializers.PrimaryKeyRelatedField(
#         queryset=ProfRegister.objects.all(), source='prof_id', write_only=True
#     )
#     prof_id = ProfReadSerializer(read_only=True)
#     status = StatusSerializer(read_only=True)

#     class Meta:
#         model = Formation
#         fields = [
#             'id', 
#             'title', 
#             'description', 
#             'parametre_formation_id', 
#             'formation_domaine', 
#             'formation_domaine_id',
#             'prof_id',
#             'prof_id_id',
#             'status', 
#             'chapters',
#         ]

#     def create(self, validated_data):
#         print("Formation validated data:", validated_data)
#         parametre_data = validated_data.pop('parametre_formation_id')
#         chapters_data = validated_data.pop('chapters', [])
        
#         parametre = Parametre_formation.objects.create(**parametre_data)
        
#         formation = Formation.objects.create(
#             parametre_formation_id=parametre,
#             status=Status.objects.get(value=1),
#             **validated_data
#         )
#         print("Created formation ID:", formation)  # Débogage

#         for chapter_data in chapters_data:
#             chapter_data['formation_id'] = formation.id
#             print("Chapter data before serialization:", chapter_data)
#             chapter_serializer = ChapterSerializer(data=chapter_data)
#             if chapter_serializer.is_valid(raise_exception=True):
#                 chapter_serializer.save()
#             else:
#                 print("Chapter serializer errors:", chapter_serializer.errors)
                
#         return formation
    

    
# class ChapterSerializer(serializers.ModelSerializer):
#     videos = VideoSerializer(many=True, required=False)
#     formation_id = FormationSimpleSerializer(write_only=True)
#     # formation_id = FormationSerializer(required=True)

#     class Meta:
#         model = Chapter
#         fields = ['id', 'chapter_name', 'description', 'chapter_number', 'videos', 'formation_id']

#     def validate(self, data):
#         print("ChapterSerializer validate data:", data)
#         # Validation manuelle de formation_id
#         formation_id = data.get('formation_id')
#         if not Formation.objects.filter(id=formation_id).exists():
#             raise serializers.ValidationError({"formation_id": "Formation does not exist."})
#         return data

#     def create(self, validated_data):
#         print("ChapterSerializer create validated_data:", validated_data)
#         videos_data = validated_data.pop('videos', [])
#         chapter = Chapter.objects.create(**validated_data)
#         for video_data in videos_data:
#             video = Video.objects.create(**video_data)
#             chapter.video.add(video)
#         return chapter


# class ChapterSerializer(serializers.ModelSerializer):
#     videos = VideoSerializer(many=True, required=False)
#     formation_id = serializers.PrimaryKeyRelatedField(
#         queryset=Formation.objects.all(), write_only=True
#     )

#     class Meta:
#         model = Chapter
#         fields = ['id', 'chapter_name', 'description', 'chapter_number', 'videos', 'formation_id']

#     def create(self, validated_data):
#         videos_data = validated_data.pop('videos', [])
#         chapter = Chapter.objects.create(**validated_data)
#         for video_data in videos_data:
#             video = Video.objects.create(**video_data)
#             chapter.video.add(video)
#         return chapter


class DomaineSerializer(serializers.ModelSerializer):
    formations = FormationSerializer(many=True, read_only=True,source='formation_set')
    class Meta:
        model = Domaine
        fields = ['id','name','image','formations']


# class FormationByUserSerializer(serializers.ModelSerializer):
#     user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')
#     # student_name=serializers.CharField(read_only=True)
#     # user_id=EtudiantReadSerializer(read_only=True)
#     # formation_id = FormationSerializer(read_only=True)
#     formation_id = serializers.PrimaryKeyRelatedField(queryset=Formation.objects.all(), source='formation')

#     class Meta:
#         model = Formation_by_user
#         fields = ['user_id', 'formation_id']
#         # read_only_fields = ['id']

#     def validate(self, data):
#         if not User.objects.filter(id=data['user_id'].id).exists():
#             raise serializers.ValidationError("Utilisateur non trouvé fona ehhhhhh")
#         if not Formation.objects.filter(id=data['formation_id'].id).exists():
#             raise serializers.ValidationError("Formation non trouvée")
#         return data

class PaymentSerializer(serializers.ModelSerializer):
    formation_by_user_id = serializers.PrimaryKeyRelatedField(queryset=Formation_by_user.objects.all(), write_only=True)  # Source supprimé

    class Meta:
        model = Payment
        fields = ['id', 'paid_amount', 'ref_transaction', 'formation_by_user_id']
        read_only_fields = ['id', 'payement_date']

    def validate(self, data):
        if not Formation_by_user.objects.filter(id=data['formation_by_user_id'].id).exists():
            raise serializers.ValidationError({"formation_by_user_id": "Inscription non trouvée"})
        if 'destination_number' in data and not data['destination_number'].startswith('034'):
            raise serializers.ValidationError({"destination_number": "Numéro de destination invalide"})
        return data

class FormationByUserCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    formation_id = serializers.PrimaryKeyRelatedField(queryset=Formation.objects.all(), write_only=True)
    student_name = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all(), write_only=True, required=False, default=None)

    class Meta:
        model = Formation_by_user
        fields = ['user_id', 'formation_id', 'student_name', 'status']

    def create(self, validated_data):
        student_name = validated_data.pop('student_name', None)
        status = validated_data.pop('status', None) 
        if status is None:
            status = Status.objects.get(value=0)
        formation_by_user = Formation_by_user.objects.create(
            user_id=validated_data['user_id'],
            formation_id=validated_data['formation_id'],
            student_name=student_name,
            status=status
        )
        return formation_by_user

class FormationByUserReadSerializer(serializers.ModelSerializer):
    user_id = serializers.StringRelatedField()  # Retourne username
    formation_id = serializers.PrimaryKeyRelatedField(read_only=True)  # Retourne l'id sans queryset
    formation_title = serializers.CharField(source='formation_id.title', read_only=True)  # Ajoute le titre
    status = serializers.StringRelatedField()  # Retourne name du Status
    payment = PaymentSerializer(read_only=True, many=False)

    class Meta:
        model = Formation_by_user
        fields = ['id', 'user_id', 'formation_id', 'formation_title', 'status', 'payment', 'student_name']






class DiscussionSerializer(serializers.ModelSerializer):
    source_id = UserSerializer()
    destination_id = UserSerializer()
    class Meta:
        model = Discussion
        fields = '__all__'

class RoleSerializers(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class RolesUserMappingSerializer(serializers.ModelSerializer):
    role = RoleSerializers()
    user = UserSerializer()
    class Meta:
        model = RolesUserMapping
        fields = '__all__'

class Token_souscriptionSerializer(serializers.ModelSerializer):
    validation = UserSerializer()
    class Meta:
        model = Token_souscription
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    formation_id = FormationSerializer()
    class Meta:
        model = Exam
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    exam_id = ExamSerializer()
    class Meta:
        model = Question
        fields = '__all__'

class Exam_response_selectionSerializer(serializers.ModelSerializer):
    question_id = QuestionSerializer()
    class Meta:
        model = Exam_response_selection
        fields = '__all__'

class Exam_by_userSerializer(serializers.ModelSerializer):
    formation_by_user_id = FormationByUserCreateSerializer()
    exam_id = ExamSerializer()
    class Meta:
        model = Exam_by_user
        fields = '__all__'

class Exam_response_by_userSerializer(serializers.ModelSerializer):
    question_id = QuestionSerializer()
    Exam_by_user = Exam_by_userSerializer()
    response_id = Exam_response_selectionSerializer()
    class Meta:
        model = Exam_response_by_user
        fields = '__all__'

