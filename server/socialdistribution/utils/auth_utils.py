from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated

LOCAL_NODE_REFERERS = ["http://allowed1.com", "http://allowed2.com"]


def get_custom_authenticators(request):
    return [BasicAuthentication()]


def get_custom_permissions(request):
    referer = request.META.get("HTTP_REFERER")

    # This code will requires basic auth on the local node referers addresses.
    # For remote addresses, do the auth based on Node model?
    if referer in LOCAL_NODE_REFERERS:
        return [IsAuthenticated()]  
    else:
        return []