# your_app/admin.py
from django.contrib import admin
from .models import Formation_by_user, Payment, Status, Formation

@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status')
    list_filter = ('status',)
    list_editable = ('status',)

@admin.register(Formation_by_user)
class FormationByUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'formation_id', 'student_name', 'status')
    list_filter = ('status',)
    search_fields = ('student_name', 'user_id__username')
    list_editable = ('status',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'formation_by_user_id', 'paid_amount', 'status', 'payement_date')
    list_filter = ('status',)
    search_fields = ('ref_transaction',)

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'value', 'name')
    list_editable = ('name',)